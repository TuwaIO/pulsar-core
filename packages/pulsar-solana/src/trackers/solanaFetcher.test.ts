/**
 * @file Unit tests for `solanaFetcher`: RPC errors, unknown signatures and terminal statuses.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import dayjs from 'dayjs';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { solanaFetcher, SolanaFetcherTx } from './solanaTracker';

const getSignatureStatuses = vi.fn();
const getTransaction = vi.fn();

vi.mock('@tuwaio/orbit-solana', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/orbit-solana')>();
  return {
    ...original,
    createSolanaRPC: vi.fn(() => ({
      getSignatureStatuses: (...args: unknown[]) => ({ send: () => getSignatureStatuses(...args) }),
      getTransaction: (...args: unknown[]) => ({ send: () => getTransaction(...args) }),
    })),
  };
});

function createTx(overrides: Partial<SolanaFetcherTx> = {}): SolanaFetcherTx {
  return {
    adapter: OrbitAdapter.SOLANA,
    txKey: 'signature',
    chainId: 'solana:devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    localTimestamp: dayjs().unix(),
    ...overrides,
  };
}

function createCallbacks() {
  return {
    stopPolling: vi.fn(),
    onSuccess: vi.fn(),
    onFailure: vi.fn(),
    onIntervalTick: vi.fn(),
  };
}

const txDetails = {
  meta: { fee: 5000n },
  transaction: { message: { recentBlockhash: 'blockhash', instructions: [] } },
};

describe('solanaFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('rethrows RPC errors so the polling tracker can retry instead of failing the transaction', async () => {
    getSignatureStatuses.mockRejectedValue(new Error('fetch failed'));
    const callbacks = createCallbacks();

    await expect(solanaFetcher({ tx: createTx(), ...callbacks })).rejects.toThrow('fetch failed');

    expect(callbacks.onFailure).not.toHaveBeenCalled();
    expect(callbacks.stopPolling).not.toHaveBeenCalled();
  });

  test('searches the transaction history so resumed transactions are found', async () => {
    getSignatureStatuses.mockResolvedValue({ value: [null] });

    await solanaFetcher({ tx: createTx(), ...createCallbacks() });

    expect(getSignatureStatuses).toHaveBeenCalledWith(['signature'], { searchTransactionHistory: true });
  });

  test('keeps polling an unknown signature that is less than an hour old', async () => {
    getSignatureStatuses.mockResolvedValue({ value: [null] });
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx(), ...callbacks });

    expect(callbacks.onFailure).not.toHaveBeenCalled();
    expect(callbacks.stopPolling).not.toHaveBeenCalled();
  });

  test('fails and stops an unknown signature after an hour, keeping the transaction', async () => {
    getSignatureStatuses.mockResolvedValue({ value: [null] });
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx({ localTimestamp: dayjs().subtract(2, 'hour').unix() }), ...callbacks });

    expect(callbacks.onFailure).toHaveBeenCalledWith();
    expect(callbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
  });

  test('fetches the transaction details only once per tracked transaction', async () => {
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: 1n, err: null, confirmationStatus: 'confirmed' }],
    });
    getTransaction.mockResolvedValue(txDetails);
    const tx = createTx();
    const callbacks = createCallbacks();

    await solanaFetcher({ tx, ...callbacks });
    await solanaFetcher({ tx, ...callbacks });
    await solanaFetcher({ tx, ...callbacks });

    expect(getSignatureStatuses).toHaveBeenCalledTimes(3);
    expect(getTransaction).toHaveBeenCalledTimes(1);
    expect(callbacks.onIntervalTick).toHaveBeenLastCalledWith(
      expect.objectContaining({ fee: 5000, recentBlockhash: 'blockhash', instructions: [] }),
    );
  });

  test('does not fetch the details when the transaction already has them', async () => {
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: null, err: null, confirmationStatus: 'finalized' }],
    });
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx({ fee: 5000, recentBlockhash: 'blockhash', instructions: [] }), ...callbacks });

    expect(getTransaction).not.toHaveBeenCalled();
    expect(callbacks.onSuccess).toHaveBeenCalledTimes(1);
  });

  test('reports success for a finalized transaction', async () => {
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: null, err: null, confirmationStatus: 'finalized' }],
    });
    getTransaction.mockResolvedValue(txDetails);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx(), ...callbacks });

    expect(callbacks.onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ slot: 10, confirmations: 0, fee: 5000, recentBlockhash: 'blockhash' }),
    );
    expect(callbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
  });

  test('reports failure for a transaction with an on-chain error', async () => {
    const err = { InstructionError: [0, { Custom: 1 }] };
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: 1n, err, confirmationStatus: 'confirmed' }],
    });
    getTransaction.mockResolvedValue(txDetails);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx(), ...callbacks });

    expect(callbacks.onFailure).toHaveBeenCalledWith(expect.objectContaining({ err }));
    expect(callbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
  });

  test('throws for a transaction that is not a Solana transaction', async () => {
    await expect(solanaFetcher({ tx: createTx({ adapter: OrbitAdapter.EVM }), ...createCallbacks() })).rejects.toThrow(
      'Tx adapter is not Solana',
    );
  });
});
