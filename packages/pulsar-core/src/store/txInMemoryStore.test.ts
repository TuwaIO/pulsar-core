import { OrbitAdapter } from '@tuwaio/orbit-core';
import { produce } from 'immer';
import { describe, expect, it, vi } from 'vitest';

import { EvmTransaction, TransactionStatus, TransactionTracker } from '../types';
import { createTxInMemoryStore } from './txInMemoryStore';

function createTransaction(overrides: Partial<EvmTransaction> = {}): EvmTransaction {
  return {
    adapter: OrbitAdapter.EVM,
    chainId: 1,
    connectorType: 'injected',
    from: '0x0000000000000000000000000000000000000001',
    localTimestamp: 1,
    pending: false,
    status: TransactionStatus.Success,
    tracker: TransactionTracker.Ethereum,
    txKey: '0x1',
    type: 'SWAP',
    ...overrides,
  };
}

const wallet = '0x0000000000000000000000000000000000000001';

describe('createTxInMemoryStore', () => {
  it('stops loading when getHistory returns null', async () => {
    const getHistory = vi.fn().mockResolvedValue(null);
    const store = createTxInMemoryStore<EvmTransaction>({ localTransactionsPool: {}, getHistory });

    await store.getState().fetchInitial(wallet);

    expect(getHistory).toHaveBeenCalledWith({ page: 1, walletAddress: wallet });
    expect(store.getState().isLoading).toBe(false);
    expect(store.getState().isError).toBe(false);
  });

  it('can load the next page after a null response', async () => {
    const getHistory = vi
      .fn()
      .mockResolvedValueOnce({
        docs: [createTransaction({ txKey: '0x1' })],
        totalDocs: 2,
        totalPages: 2,
        page: 1,
        hasNextPage: true,
        hasPrevPage: false,
      })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        docs: [createTransaction({ txKey: '0x2' })],
        totalDocs: 2,
        totalPages: 2,
        page: 2,
        hasNextPage: false,
        hasPrevPage: true,
      });
    const store = createTxInMemoryStore<EvmTransaction>({ localTransactionsPool: {}, getHistory });

    await store.getState().fetchInitial(wallet);
    await store.getState().fetchNextPage(wallet);
    await store.getState().fetchNextPage(wallet);

    expect(getHistory).toHaveBeenCalledTimes(3);
    expect(Object.keys(store.getState().transactionsPool)).toEqual(['0x1', '0x2']);
    expect(store.getState().currentPage).toBe(2);
    expect(store.getState().hasMore).toBe(false);
    expect(store.getState().isLoading).toBe(false);
  });

  it('sets isError when getHistory throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const store = createTxInMemoryStore<EvmTransaction>({
      localTransactionsPool: {},
      getHistory: vi.fn().mockRejectedValue(new Error('offline')),
    });

    await store.getState().fetchInitial(wallet);

    expect(store.getState().isLoading).toBe(false);
    expect(store.getState().isError).toBe(true);
  });

  it('keeps terminal transactions when merging a local pool', () => {
    const terminal = createTransaction({ txKey: '0x1', status: TransactionStatus.Success, pending: false });
    const store = createTxInMemoryStore<EvmTransaction>({ localTransactionsPool: { '0x1': terminal } });

    store.getState().syncWithLocalPool({
      '0x1': createTransaction({ txKey: '0x1', status: undefined, pending: true }),
    });

    expect(store.getState().transactionsPool['0x1']).toEqual(terminal);
  });

  it('moves a pending transaction to Failed when the local pool reports the failure', () => {
    const pending = createTransaction({ txKey: '0x1', status: undefined, pending: true });
    const store = createTxInMemoryStore<EvmTransaction>({ localTransactionsPool: { '0x1': pending } });

    store.getState().syncWithLocalPool({
      '0x1': createTransaction({ txKey: '0x1', status: TransactionStatus.Failed, pending: false, isError: true }),
    });

    expect(store.getState().transactionsPool['0x1']).toEqual(
      expect.objectContaining({ status: TransactionStatus.Failed, pending: false, isError: true }),
    );
  });

  it('keeps a failed transaction when a stale pending copy arrives', () => {
    const failed = createTransaction({ txKey: '0x1', status: TransactionStatus.Failed, pending: false, isError: true });
    const store = createTxInMemoryStore<EvmTransaction>({ localTransactionsPool: { '0x1': failed } });

    store.getState().syncWithLocalPool({
      '0x1': createTransaction({ txKey: '0x1', status: undefined, pending: true }),
    });

    expect(store.getState().transactionsPool['0x1']).toEqual(failed);
  });

  it('skips invalid history transactions and does not pass them to onHistoryFetched', async () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const onHistoryFetched = vi.fn();
    const store = createTxInMemoryStore<EvmTransaction>({
      localTransactionsPool: {},
      onHistoryFetched,
      getHistory: vi.fn().mockResolvedValue({
        docs: [createTransaction({ txKey: '0x1' }), createTransaction({ txKey: '0x2', title: 'javascript:alert(1)' })],
        totalDocs: 2,
        totalPages: 1,
        page: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }),
    });

    await store.getState().fetchInitial(wallet);
    await vi.waitFor(() => expect(onHistoryFetched).toHaveBeenCalledTimes(1));

    expect(Object.keys(store.getState().transactionsPool)).toEqual(['0x1']);
    expect(onHistoryFetched.mock.calls[0][0].map((tx: EvmTransaction) => tx.txKey)).toEqual(['0x1']);
    expect(consoleWarn).toHaveBeenCalledTimes(1);
    consoleWarn.mockRestore();
  });

  it('does not change the global Immer auto-freeze setting', () => {
    createTxInMemoryStore<EvmTransaction>({ localTransactionsPool: {} });

    const result = produce({ nested: { value: 1 } }, (draft) => {
      draft.nested.value = 2;
    });

    expect(Object.isFrozen(result)).toBe(true);
  });
});
