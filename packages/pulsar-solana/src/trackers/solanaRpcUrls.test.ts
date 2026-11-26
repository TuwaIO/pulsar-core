/**
 * @file The RPC URLs of a cluster, over the real clients of `@tuwaio/orbit-solana`: the next one when one does not answer.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { TransactionTracker } from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { pulsarSolanaAdapter } from '../adapters/solanaAdapter';
import { solanaFetcher, SolanaFetcherTx } from './solanaTracker';

vi.mock('@tuwaio/orbit-solana', async (importActual) => ({
  ...(await importActual<typeof import('@tuwaio/orbit-solana')>()),
  getAvailableSolanaConnectors: vi.fn(() => [{ name: 'Phantom', accounts: [{ address: 'Addr' }] }]),
}));

const MAIN = 'https://main.example/';
const SPARE = 'https://spare.example/';

describe('the RPC URLs of a cluster', () => {
  const asked: string[] = [];

  beforeEach(() => {
    asked.length = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
        const url = String(input instanceof Request ? input.url : input);
        asked.push(url);
        if (url === MAIN) return new Response('too many requests', { status: 429 });
        const { method } = JSON.parse(String(init?.body)) as { method: string };
        const value = [{ slot: 1, confirmations: 1, err: null, status: { Ok: null }, confirmationStatus: 'processed' }];
        const result = method === 'getSignatureStatuses' ? { context: { slot: 1 }, value } : 7;
        return Response.json({ jsonrpc: '2.0', id: '1', result });
      }),
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const callbacks = () => ({ stopPolling: vi.fn(), onSuccess: vi.fn(), onFailure: vi.fn(), onIntervalTick: vi.fn() });
  const tx = (rpcUrl: SolanaFetcherTx['rpcUrl']): SolanaFetcherTx => ({
    adapter: OrbitAdapter.SOLANA,
    txKey: 'signature',
    chainId: 'solana:devnet',
    rpcUrl,
    localTimestamp: dayjs().unix(),
  });

  test('a signature is read through the next one when the first does not answer', async () => {
    const { onIntervalTick, ...rest } = callbacks();
    await solanaFetcher({ tx: tx([MAIN, SPARE]), onIntervalTick, ...rest });

    expect(asked.slice(0, 2)).toEqual([MAIN, SPARE]);
    expect(onIntervalTick).toHaveBeenCalledWith(expect.objectContaining({ confirmationStatus: 'processed' }));
  });

  test('one URL is read over that URL, whatever the cluster was read over before', async () => {
    const { onIntervalTick, ...rest } = callbacks();
    await solanaFetcher({ tx: tx(SPARE), onIntervalTick, ...rest });

    expect(new Set(asked)).toEqual(new Set([SPARE]));
  });

  test('a retry hands its action a client over all of them', async () => {
    const executeTxAction = vi.fn(async ({ actionFunction }: { actionFunction: () => unknown }) => {
      await actionFunction();
    });
    const read = vi.fn(async ({ client }: { client: { rpc: { getSlot: () => { send: () => Promise<bigint> } } } }) =>
      client.rpc.getSlot().send(),
    );
    const adapter = pulsarSolanaAdapter({ rpcUrls: { devnet: [`${MAIN}?retry`, SPARE] } });
    vi.mocked(fetch).mockImplementationOnce(async () => new Response('', { status: 503 }));

    await adapter.retryTxAction?.({
      tx: {
        adapter: OrbitAdapter.SOLANA,
        desiredChainID: 'devnet',
        type: 'SWAP',
        tracker: TransactionTracker.Solana,
        actionFunction: read,
      } as never,
      txKey: '',
      onClose: vi.fn(),
      executeTxAction: executeTxAction as never,
    });

    await expect(read.mock.results[0].value).resolves.toBe(7n);
    expect(asked).toEqual([SPARE]);
  });
});
