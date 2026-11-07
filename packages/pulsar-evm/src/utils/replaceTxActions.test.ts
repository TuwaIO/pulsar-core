/**
 * @file Tests of the wallet actions that replace a pending transaction: `speedUpTxAction` and `cancelTxAction`.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { Transaction, TransactionTracker } from '@tuwaio/pulsar-core';
import { Config, getAccount, getClient, sendTransaction } from '@wagmi/core';
import { estimateFeesPerGas } from 'viem/actions';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { cancelTxAction } from './cancelTxAction';
import { speedUpTxAction } from './speedUpTxAction';

vi.mock('@wagmi/core', async (importActual) => ({
  ...(await importActual<typeof import('@wagmi/core')>()),
  getAccount: vi.fn(),
  getClient: vi.fn(),
  sendTransaction: vi.fn(),
}));
vi.mock('viem/actions', async (importActual) => ({
  ...(await importActual<typeof import('viem/actions')>()),
  estimateFeesPerGas: vi.fn(),
}));

const WALLET = '0xad9a211d227d2d9c1b5573f73cda0284b758ac0c';
const OTHER = '0xb8d9b1ec1c1f8bea7fb10450198c0b47d50c96b7';
const config = {} as Config;
let nextNonce = 100;

// A new nonce for every test: the fees last sent for a nonce are remembered for as long as the page lives
const pendingTx = (fields: Record<string, unknown> = {}) =>
  ({
    adapter: OrbitAdapter.EVM,
    tracker: TransactionTracker.Ethereum,
    txKey: `0x${'a'.repeat(64)}`,
    chainId: 11155111,
    from: WALLET,
    sender: WALLET,
    to: OTHER,
    value: '1000',
    input: '0xabcd',
    nonce: nextNonce++,
    maxFeePerGas: '1000',
    maxPriorityFeePerGas: '100',
    pending: true,
    ...fields,
  }) as unknown as Transaction;

const lastSent = () => vi.mocked(sendTransaction).mock.lastCall?.[1] as Record<string, unknown>;

describe.each([
  ['speedUpTxAction', speedUpTxAction],
  ['cancelTxAction', cancelTxAction],
])('%s', (name, action) => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAccount).mockReturnValue({ address: WALLET } as never);
    vi.mocked(getClient).mockReturnValue({} as never);
    vi.mocked(sendTransaction).mockResolvedValue(`0x${'b'.repeat(64)}`);
    vi.mocked(estimateFeesPerGas).mockResolvedValue({ maxFeePerGas: 1n, maxPriorityFeePerGas: 1n } as never);
  });

  test('sends from the account that sent the transaction, in the same nonce', async () => {
    const tx = pendingTx();

    await action({ config, tx });

    expect(lastSent().account).toBe(WALLET);
    expect(lastSent().nonce).toBe((tx as unknown as { nonce: number }).nonce);
    expect(lastSent().chainId).toBe(11155111);
  });

  test('refuses another connected account: its wallet would pay a second time', async () => {
    vi.mocked(getAccount).mockReturnValue({ address: OTHER } as never);

    await expect(action({ config, tx: pendingTx() })).rejects.toThrow(/did not send/);

    expect(sendTransaction).not.toHaveBeenCalled();
  });

  test('refuses a relayed transaction: its nonce is the relayer, not the wallet', async () => {
    await expect(action({ config, tx: pendingTx({ sender: OTHER }) })).rejects.toThrow(/did not send/);

    expect(sendTransaction).not.toHaveBeenCalled();
  });

  test('raises both fees by 15%, rounded up, in exact integers', async () => {
    await action({ config, tx: pendingTx({ maxFeePerGas: '100000000000000000001', maxPriorityFeePerGas: '7' }) });

    expect(lastSent().maxFeePerGas).toBe(115000000000000000002n);
    expect(lastSent().maxPriorityFeePerGas).toBe(9n);
  });

  test('a transaction stuck below the market pays the market, or 15% more would stay stuck', async () => {
    vi.mocked(estimateFeesPerGas).mockResolvedValue({
      maxFeePerGas: 5_000_000n,
      maxPriorityFeePerGas: 2_000_000n,
    } as never);

    await action({ config, tx: pendingTx() });

    expect(lastSent().maxFeePerGas).toBe(5_000_000n);
    expect(lastSent().maxPriorityFeePerGas).toBe(2_000_000n);
  });

  test('the priority fee never exceeds the max fee', async () => {
    vi.mocked(estimateFeesPerGas).mockResolvedValue({ maxFeePerGas: 1n, maxPriorityFeePerGas: 9000n } as never);

    await action({ config, tx: pendingTx() });

    expect(lastSent().maxFeePerGas).toBe(9000n);
    expect(lastSent().maxPriorityFeePerGas).toBe(9000n);
  });

  test('without a market estimate the 15% still goes out', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(estimateFeesPerGas).mockRejectedValue(new Error('rate limited'));

    await action({ config, tx: pendingTx() });

    expect(lastSent().maxFeePerGas).toBe(1150n);
    expect(lastSent().maxPriorityFeePerGas).toBe(115n);
  });

  test('a second press goes above the first: the same fees would be refused as underpriced', async () => {
    const tx = pendingTx();

    await action({ config, tx });
    await action({ config, tx });

    expect(lastSent().maxFeePerGas).toBe(1323n);
    expect(lastSent().maxPriorityFeePerGas).toBe(133n);
  });

  test('a fee of zero still goes up: 15% of nothing would be refused as underpriced', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(estimateFeesPerGas).mockRejectedValue(new Error('rate limited'));

    await action({ config, tx: pendingTx({ maxPriorityFeePerGas: '0' }) });

    expect(lastSent().maxPriorityFeePerGas).toBe(1n);
  });

  test('the fees last sent survive a reload, in the memory of the tab', async () => {
    const saved = new Map<string, string>();
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: (key: string) => saved.get(key) ?? null,
        setItem: (key: string, value: string) => saved.set(key, value),
      },
    });
    try {
      const tx = pendingTx();
      await action({ config, tx });
      expect(saved.size).toBe(1);
      // A reload: the same key is read from storage by a page whose memory has only the storage to go on
      const [[key, value]] = saved;
      expect(key).toContain('pulsar-evm:replacementFees:');
      expect(JSON.parse(value)).toEqual({ maxFeePerGas: '1150', maxPriorityFeePerGas: '115' });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  // Node 26 has a `sessionStorage` on the server too, one for the whole process. It is no memory of a tab
  test('keeps nothing in a storage with no browser around it', async () => {
    const setItem = vi.fn();
    vi.stubGlobal('sessionStorage', { getItem: () => null, setItem });
    try {
      await action({ config, tx: pendingTx() });
      expect(setItem).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  test('a press the wallet refused does not count', async () => {
    const tx = pendingTx();
    vi.mocked(sendTransaction).mockRejectedValueOnce(new Error('User rejected the request.'));

    await expect(action({ config, tx })).rejects.toThrow(/User rejected/);
    await action({ config, tx });

    expect(lastSent().maxFeePerGas).toBe(1150n);
  });

  test('the error keeps the wallet error as its cause', async () => {
    const cause = new Error('replacement transaction underpriced');
    vi.mocked(sendTransaction).mockRejectedValueOnce(cause);

    const error = await action({ config, tx: pendingTx() }).catch((e: unknown) => e);

    expect((error as Error).cause).toBe(cause);
    expect(name).toBeTruthy();
  });
});

describe('speed-up and cancel of one transaction', () => {
  test('a cancel after a speed-up goes above the speed-up', async () => {
    vi.clearAllMocks();
    vi.mocked(getAccount).mockReturnValue({ address: WALLET } as never);
    vi.mocked(getClient).mockReturnValue({} as never);
    vi.mocked(sendTransaction).mockResolvedValue(`0x${'b'.repeat(64)}`);
    vi.mocked(estimateFeesPerGas).mockResolvedValue({ maxFeePerGas: 1n, maxPriorityFeePerGas: 1n } as never);
    const tx = pendingTx();

    await speedUpTxAction({ config, tx });
    await cancelTxAction({ config, tx });

    expect(lastSent().to).toBe(WALLET);
    expect(lastSent().value).toBe(0n);
    expect(lastSent().maxFeePerGas).toBe(1323n);
  });

  test('a speed-up keeps what the transaction sends', async () => {
    vi.mocked(getAccount).mockReturnValue({ address: WALLET } as never);

    await speedUpTxAction({ config, tx: pendingTx() });

    expect(lastSent().to).toBe(OTHER);
    expect(lastSent().value).toBe(1000n);
    expect(lastSent().data).toBe('0xabcd');
  });
});
