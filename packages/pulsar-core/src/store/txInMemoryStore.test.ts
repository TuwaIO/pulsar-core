import { OrbitAdapter } from '@tuwaio/orbit-core';
import { produce } from 'immer';
import { describe, expect, it, vi } from 'vitest';

import { EvmTransaction, Transaction, TransactionStatus, TransactionTracker } from '../types';
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

  // After a reorganization the original is the one that landed: the history kept both as replaced by each other, for good
  it("takes this device's Success over a Replaced, but no server's", () => {
    const replaced = createTransaction({
      txKey: '0x1',
      status: TransactionStatus.Replaced,
      pending: false,
      replacedTxHash: '0x2',
    });
    const store = createTxInMemoryStore<EvmTransaction>({ localTransactionsPool: { '0x1': replaced } });
    const success = createTransaction({ txKey: '0x1', status: TransactionStatus.Success, pending: false });
    store.getState().syncWithLocalPool({ '0x1': success });
    expect(store.getState().transactionsPool['0x1']).toEqual(success);
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

describe('createTxInMemoryStore: what the local tracker knows and a server does not', () => {
  const key = '0xabc';
  const pending = { txKey: key, pending: true, nonce: 7 } as unknown as Transaction;
  const withStatus = (status: TransactionStatus, fields: Record<string, unknown> = {}) =>
    ({ txKey: key, pending: false, status, ...fields }) as unknown as Transaction;

  const make = (pool: Record<string, Transaction>) =>
    createTxInMemoryStore<Transaction>({ localTransactionsPool: pool as never });

  it('lets the chain correct a Failed from a server', () => {
    const store = make({ [key]: withStatus(TransactionStatus.Failed, { error: { message: 'Timed out' } }) });

    store.getState().syncWithLocalPool({ [key]: withStatus(TransactionStatus.Success) } as never);

    const tx = store.getState().transactionsPool[key];
    expect(tx.status).toBe(TransactionStatus.Success);
    expect(tx.error).toBeUndefined();
  });

  it('does not take a Failed over the answer of the chain', () => {
    const store = make({ [key]: withStatus(TransactionStatus.Success) });

    store.getState().syncWithLocalPool({ [key]: withStatus(TransactionStatus.Failed) } as never);

    expect(store.getState().transactionsPool[key].status).toBe(TransactionStatus.Success);
  });

  it('gives the local fields to a pending copy: speed-up and cancel need its nonce and fees', () => {
    const store = make({ [key]: { txKey: key, pending: true } as unknown as Transaction });

    store.getState().syncWithLocalPool({ [key]: pending } as never);

    expect((store.getState().transactionsPool[key] as unknown as { nonce: number }).nonce).toBe(7);
  });

  it.each([
    ['a Failed', TransactionStatus.Failed, {}],
    ['a Replaced with no reason', TransactionStatus.Replaced, { replacedTxHash: '0xnew' }],
  ])('does not put %s from a server over a pending copy', async (_name, status, fields) => {
    const store = createTxInMemoryStore<Transaction>({
      localTransactionsPool: { [key]: pending } as never,
      getHistory: async () =>
        ({
          docs: [
            {
              ...withStatus(status, fields),
              adapter: 'evm',
              tracker: 'ethereum',
              chainId: 1,
              from: '0x1',
              type: 'T',
              localTimestamp: 1,
            },
          ],
          page: 1,
          hasNextPage: false,
        }) as never,
    });

    await store.getState().fetchInitial('0x1');

    expect(store.getState().transactionsPool[key].pending).toBe(true);
  });

  describe('removeTxFromPool', () => {
    const pendingTx = () => createTransaction({ pending: true, status: undefined });

    it('removes the record: nothing else can finish it once its tracker has been stopped', () => {
      const store = createTxInMemoryStore<EvmTransaction>({ localTransactionsPool: { '0x1': pendingTx() } });

      store.getState().removeTxFromPool('0x1');

      expect(store.getState().transactionsPool['0x1']).toBeUndefined();
    });

    it('the next sync does not bring it back', () => {
      const store = createTxInMemoryStore<EvmTransaction>({ localTransactionsPool: { '0x1': pendingTx() } });

      store.getState().removeTxFromPool('0x1');
      store.getState().syncWithLocalPool({ '0x1': pendingTx() });

      expect(store.getState().transactionsPool['0x1']).toBeUndefined();
    });

    it('the next page of the history does not bring it back', async () => {
      const getHistory = vi.fn().mockResolvedValue({ docs: [pendingTx()], page: 1, hasNextPage: false });
      const store = createTxInMemoryStore<EvmTransaction>({
        localTransactionsPool: { '0x1': pendingTx() },
        getHistory,
      });

      store.getState().removeTxFromPool('0x1');
      await store.getState().fetchInitial(wallet);

      expect(store.getState().transactionsPool['0x1']).toBeUndefined();
    });

    it('leaves the others', () => {
      const other = createTransaction({ txKey: '0x2' });
      const store = createTxInMemoryStore<EvmTransaction>({
        localTransactionsPool: { '0x1': pendingTx(), '0x2': other },
      });

      store.getState().removeTxFromPool('0x1');

      expect(store.getState().transactionsPool['0x2']).toBe(other);
    });
  });

  // Another wallet connected while a page of the first was on its way, and its answer overwrote the pagination
  it('takes no answer of a request a newer one has replaced', async () => {
    const answers: ((value: unknown) => void)[] = [];
    const getHistory = vi.fn(() => new Promise((resolve) => answers.push(resolve))) as never;
    const store = createTxInMemoryStore<EvmTransaction>({ localTransactionsPool: {}, getHistory });
    const first = store.getState().fetchInitial('0xold');
    const second = store.getState().fetchInitial('0xnew');
    await new Promise((resolve) => setImmediate(resolve));
    answers[1]({ docs: [], page: 1, hasNextPage: false, totalDocs: 0, totalPages: 1 });
    await second;
    answers[0]({
      docs: [createTransaction({ txKey: '0xold' })],
      page: 7,
      hasNextPage: true,
      totalDocs: 1,
      totalPages: 9,
    });
    await first;
    expect(store.getState().currentPage).toBe(1);
    expect(store.getState().hasMore).toBe(false);
    expect(store.getState().transactionsPool['0xold']).toBeUndefined();
  });
});
