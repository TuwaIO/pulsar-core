import { OrbitAdapter } from '@tuwaio/orbit-core';
import { describe, expect, it, vi } from 'vitest';
import { createJSONStorage, StateStorage } from 'zustand/middleware';

import {
  EvmTransaction,
  InitialTransactionParams,
  ITxTrackingStore,
  TransactionStatus,
  TransactionTracker,
  TxAdapter,
} from '../types';
import { PulsarTransactionValidationError } from '../utils/transactionValidation';
import { createPulsarStore } from './txTrackingStore';

const txHash = '0x123';

function createAdapter(overrides: Partial<TxAdapter<EvmTransaction>> = {}): TxAdapter<EvmTransaction> {
  return {
    key: OrbitAdapter.EVM,
    getConnectorInfo: () => ({
      walletAddress: '0x0000000000000000000000000000000000000001',
      connectorType: 'injected',
    }),
    checkChainForTx: vi.fn().mockResolvedValue(undefined),
    checkTransactionsTracker: ({ actionTxKey }) => ({
      txKey: actionTxKey,
      tracker: TransactionTracker.Ethereum,
    }),
    checkAndInitializeTrackerInStore: vi.fn(),
    getExplorerUrl: (url?: string) => url,
    ...overrides,
  };
}

type StoreConfig = Parameters<typeof createPulsarStore<EvmTransaction>>[0];
type TestStore = ReturnType<typeof createPulsarStore<EvmTransaction>>;

function createMemoryStorage(): StateStorage {
  const storage = new Map<string, string>();

  return {
    getItem: (name) => storage.get(name) ?? null,
    setItem: (name, value) => {
      storage.set(name, value);
    },
    removeItem: (name) => {
      storage.delete(name);
    },
  };
}

function createStore(overrides: Partial<StoreConfig> = {}) {
  return createPulsarStore<EvmTransaction>({
    adapter: createAdapter(),
    name: `pulsar-test-${Math.random()}`,
    storage: createJSONStorage(createMemoryStorage),
    ...overrides,
  } as StoreConfig);
}

function createValidParams(overrides: Partial<Omit<InitialTransactionParams, 'actionFunction'>> = {}) {
  return {
    adapter: OrbitAdapter.EVM,
    desiredChainID: 1,
    title: 'Swap',
    description: 'Swap tokens',
    type: 'SWAP',
    ...overrides,
  };
}

function setStoreState(store: TestStore, state: Partial<ITxTrackingStore<EvmTransaction>>) {
  (store as unknown as { setState: (state: Partial<ITxTrackingStore<EvmTransaction>>) => void }).setState(state);
}

function createTransaction(overrides: Partial<EvmTransaction> = {}): EvmTransaction {
  return {
    adapter: OrbitAdapter.EVM,
    chainId: 1,
    connectorType: 'injected',
    from: '0x0000000000000000000000000000000000000001',
    localTimestamp: 1,
    pending: true,
    tracker: TransactionTracker.Ethereum,
    txKey: txHash,
    type: 'SWAP',
    title: 'Swap',
    description: 'Swap tokens',
    ...overrides,
  };
}

describe('txTrackingStore validation', () => {
  it('blocks invalid executeTxAction before creating initialTx or calling actionFunction', async () => {
    const store = createStore();
    const actionFunction = vi.fn().mockResolvedValue(txHash);

    await expect(
      store.getState().executeTxAction({
        actionFunction,
        params: createValidParams({
          title: 'a'.repeat(101),
        }),
      }),
    ).rejects.toThrow(PulsarTransactionValidationError);

    expect(actionFunction).not.toHaveBeenCalled();
    expect(store.getState().initialTx).toBeUndefined();
    expect(store.getState().transactionsPool).toEqual({});
  });

  it('uses local beforeTxProcess instead of the global callback', async () => {
    const globalBeforeTxProcess = vi.fn().mockRejectedValue(new Error('global blocked'));
    const localBeforeTxProcess = vi.fn().mockResolvedValue(undefined);
    const actionFunction = vi.fn().mockResolvedValue(txHash);
    const store = createStore({ beforeTxProcess: globalBeforeTxProcess });

    await store.getState().executeTxAction({
      actionFunction,
      params: createValidParams(),
      beforeTxProcess: localBeforeTxProcess,
    });

    expect(globalBeforeTxProcess).not.toHaveBeenCalled();
    expect(localBeforeTxProcess).toHaveBeenCalledTimes(1);
    expect(actionFunction).toHaveBeenCalledTimes(1);
  });

  it('blocks when beforeTxProcess throws (default behavior)', async () => {
    const actionFunction = vi.fn().mockResolvedValue(txHash);
    const store = createStore({
      beforeTxProcess: vi.fn().mockRejectedValue(new Error('blocked')),
    });

    await expect(
      store.getState().executeTxAction({
        actionFunction,
        params: createValidParams(),
      }),
    ).rejects.toThrow('blocked');

    expect(actionFunction).not.toHaveBeenCalled();
    expect(store.getState().initialTx).toBeDefined();
    expect(store.getState().initialTx?.error?.message).toBe('blocked');
    expect(store.getState().initialTx?.isInitializing).toBe(false);
  });

  it('does not block when beforeTxProcess throws if abortOnTxError is false', async () => {
    const actionFunction = vi.fn().mockResolvedValue(txHash);
    const store = createStore({
      beforeTxProcess: vi.fn().mockRejectedValue(new Error('blocked')),
      abortOnTxError: false,
    });

    await store.getState().executeTxAction({
      actionFunction,
      params: createValidParams(),
    });

    expect(actionFunction).toHaveBeenCalledTimes(1);
    expect(store.getState().initialTx?.error).toBeUndefined();
  });

  it('does not block or throw when onRemoteCreate throws, adds to unsyncedTxKeys instead', async () => {
    const actionFunction = vi.fn().mockResolvedValue(txHash);
    const onRemoteCreate = vi.fn().mockRejectedValue(new Error('remote-sync-failed'));
    const store = createStore({
      onRemoteCreate,
    });

    await store.getState().executeTxAction({
      actionFunction,
      params: createValidParams(),
    });

    expect(actionFunction).toHaveBeenCalledTimes(1);
    const poolTx = store.getState().transactionsPool[txHash];
    expect(poolTx).toBeDefined();
    expect(poolTx.syncStatus).toBe('pending-sync');
    expect(store.getState().unsyncedTxKeys?.[txHash]).toBe(true);
    expect(store.getState().initialTx?.isInitializing).toBe(false);
  });

  it('rejects invalid direct addTxToPool calls', () => {
    const store = createStore();

    expect(() =>
      store.getState().addTxToPool(
        createTransaction({
          description: 'a'.repeat(301),
        }),
      ),
    ).toThrow(PulsarTransactionValidationError);

    expect(store.getState().transactionsPool).toEqual({});
  });

  it('removes invalid persisted pending transactions during initialization', async () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const checkAndInitializeTrackerInStore = vi.fn();
    const store = createStore({
      adapter: createAdapter({ checkAndInitializeTrackerInStore }),
    });

    setStoreState(store, {
      transactionsPool: {
        valid: createTransaction({ txKey: 'valid' }),
        invalid: createTransaction({ txKey: 'invalid', title: 'a'.repeat(101) }),
      },
    });

    await store.getState().initializeTransactionsPool();

    expect(consoleWarn).toHaveBeenCalledTimes(1);
    expect(store.getState().transactionsPool.invalid).toBeUndefined();
    expect(store.getState().transactionsPool.valid).toBeDefined();
    expect(checkAndInitializeTrackerInStore).toHaveBeenCalledTimes(1);
    consoleWarn.mockRestore();
  });

  it('skips invalid remote transactions and keeps valid ones', async () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const checkAndInitializeTrackerInStore = vi.fn();
    const store = createStore({
      adapter: createAdapter({ checkAndInitializeTrackerInStore }),
    });

    await store
      .getState()
      .injectExternalPendingTxs([
        createTransaction({ txKey: 'valid' }),
        createTransaction({ txKey: 'invalid', payload: { code: 'eval(alert)' } }),
      ]);

    expect(consoleWarn).toHaveBeenCalledTimes(1);
    expect(store.getState().transactionsPool.valid).toBeDefined();
    expect(store.getState().transactionsPool.invalid).toBeUndefined();
    expect(checkAndInitializeTrackerInStore).toHaveBeenCalledTimes(1);
    consoleWarn.mockRestore();
  });
});

describe('txTrackingStore chain IDs', () => {
  it('saves a Solana transaction under the genesis-hash chain ID of its cluster', async () => {
    const store = createStore({ adapter: createAdapter({ key: OrbitAdapter.SOLANA }) });

    await store.getState().executeTxAction({
      actionFunction: vi.fn().mockResolvedValue(txHash),
      params: createValidParams({ adapter: OrbitAdapter.SOLANA, desiredChainID: 'devnet' }),
    });

    expect(store.getState().transactionsPool[txHash].chainId).toBe('solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1');
  });

  it('keeps numeric EVM chain IDs', async () => {
    const store = createStore();

    await store.getState().executeTxAction({
      actionFunction: vi.fn().mockResolvedValue(txHash),
      params: createValidParams({ desiredChainID: 11155111 }),
    });

    expect(store.getState().transactionsPool[txHash].chainId).toBe(11155111);
  });
});

describe('txTrackingStore remote sync', () => {
  it('adds the transaction and starts its tracker without waiting for onRemoteCreate', async () => {
    let resolveSync!: () => void;
    const onRemoteCreate = vi.fn(() => new Promise<void>((resolve) => (resolveSync = resolve)));
    const checkAndInitializeTrackerInStore = vi.fn();
    const store = createStore({ onRemoteCreate, adapter: createAdapter({ checkAndInitializeTrackerInStore }) });

    await store.getState().executeTxAction({
      actionFunction: vi.fn().mockResolvedValue(txHash),
      params: createValidParams(),
    });

    // The sync is still in flight, but the transaction is tracked already.
    expect(checkAndInitializeTrackerInStore).toHaveBeenCalledTimes(1);
    expect(store.getState().transactionsPool[txHash].syncStatus).toBe('pending-sync');
    expect(store.getState().unsyncedTxKeys?.[txHash]).toBe(true);

    resolveSync();
    await vi.waitFor(() => expect(store.getState().transactionsPool[txHash].syncStatus).toBe('synced'));
    expect(store.getState().unsyncedTxKeys?.[txHash]).toBeUndefined();
  });

  it('never sends pimlicoApiKey or gelatoApiKey to onRemoteCreate', async () => {
    const onRemoteCreate = vi.fn().mockResolvedValue(undefined);
    const store = createStore({ onRemoteCreate });

    await store.getState().addTxToPool({
      ...createTransaction(),
      pimlicoApiKey: 'pim_secret',
      bundlerUrl: 'https://bundler.example',
      gelatoApiKey: 'gelato_secret',
    } as EvmTransaction);

    await vi.waitFor(() => expect(onRemoteCreate).toHaveBeenCalledTimes(1));
    const sentTx = onRemoteCreate.mock.calls[0][0] as Record<string, unknown>;
    expect(sentTx).not.toHaveProperty('pimlicoApiKey');
    expect(sentTx).not.toHaveProperty('gelatoApiKey');
    expect(sentTx.bundlerUrl).toBe('https://bundler.example');
    // The local copy keeps the key, so tracking can resume after a reload.
    expect(store.getState().transactionsPool[txHash].pimlicoApiKey).toBe('pim_secret');
  });

  it('does not send a transaction twice while its first sync is in flight', async () => {
    let resolveSync!: () => void;
    const onRemoteCreate = vi.fn(() => new Promise<void>((resolve) => (resolveSync = resolve)));
    const store = createStore({ onRemoteCreate });

    await store.getState().addTxToPool(createTransaction());
    await store.getState().reconcileUnsyncedTransactions();

    expect(onRemoteCreate).toHaveBeenCalledTimes(1);
    resolveSync();
    await vi.waitFor(() => expect(store.getState().unsyncedTxKeys?.[txHash]).toBeUndefined());
  });

  it('retries a failed sync on reconciliation', async () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const onRemoteCreate = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined);
    const store = createStore({ onRemoteCreate });

    await store.getState().addTxToPool(createTransaction());
    await vi.waitFor(() => expect(consoleWarn).toHaveBeenCalledTimes(1));
    expect(store.getState().unsyncedTxKeys?.[txHash]).toBe(true);

    await store.getState().reconcileUnsyncedTransactions();

    expect(onRemoteCreate).toHaveBeenCalledTimes(2);
    expect(store.getState().transactionsPool[txHash].syncStatus).toBe('synced');
    expect(store.getState().unsyncedTxKeys?.[txHash]).toBeUndefined();
    consoleWarn.mockRestore();
  });

  it('does not set syncStatus without onRemoteCreate', async () => {
    const store = createStore();

    await store.getState().addTxToPool(createTransaction());

    expect(store.getState().transactionsPool[txHash].syncStatus).toBeUndefined();
    expect(store.getState().unsyncedTxKeys?.[txHash]).toBeUndefined();
  });
});

describe('txTrackingStore persistence', () => {
  it('does not save initialTx', async () => {
    const storage = createMemoryStorage();
    const store = createStore({ name: 'persist-test', storage: createJSONStorage(() => storage) });

    // The action never settles, so initialTx stays in the "signing" state.
    void store.getState().executeTxAction({
      actionFunction: () => new Promise<undefined>(() => undefined),
      params: createValidParams(),
    });
    await vi.waitFor(() => expect(store.getState().initialTx?.isInitializing).toBe(true));

    const saved = JSON.parse(storage.getItem('persist-test') as string) as { state: Record<string, unknown> };
    expect(saved.state).not.toHaveProperty('initialTx');
    expect(saved.state).toHaveProperty('transactionsPool');
  });

  it('does not restore an initialTx saved by an older version', () => {
    const storage = createMemoryStorage();
    storage.setItem(
      'legacy-state',
      JSON.stringify({
        state: {
          transactionsPool: { [txHash]: createTransaction() },
          initialTx: { ...createValidParams(), isInitializing: true, localTimestamp: 1 },
        },
        version: 0,
      }),
    );

    const store = createStore({ name: 'legacy-state', storage: createJSONStorage(() => storage) });

    expect(store.getState().transactionsPool[txHash]).toBeDefined();
    expect(store.getState().initialTx).toBeUndefined();
  });
});

// A finished transaction is not kept in the browser without a term (Cookie Policy of TUWA, 2026-10-16): by default it is
// dropped 30 days after it finished; a pending one stays until it finishes.
describe('retention of finished transactions', () => {
  const day = 24 * 60 * 60;
  const now = Math.floor(Date.now() / 1000);
  const finished = (txKey: string, overrides: Partial<EvmTransaction>) =>
    createTransaction({
      txKey,
      pending: false,
      status: TransactionStatus.Success,
      localTimestamp: now - 40 * day,
      ...overrides,
    });
  const pool = {
    old: finished('old', { finishedTimestamp: now - 31 * day }),
    recent: finished('recent', { finishedTimestamp: now - 29 * day }),
    // Without finishedTimestamp the term runs from localTimestamp
    noFinish: finished('noFinish', { status: TransactionStatus.Failed, localTimestamp: now - 31 * day }),
    pending: createTransaction({ txKey: 'pending', pending: true, localTimestamp: now - 90 * day }),
  };
  const restored = (overrides: Partial<StoreConfig> = {}) => {
    const storage = createMemoryStorage();
    storage.setItem('retention', JSON.stringify({ state: { transactionsPool: pool }, version: 0 }));
    const store = createStore({ name: 'retention', storage: createJSONStorage(() => storage), ...overrides });
    return Object.keys(store.getState().transactionsPool).sort();
  };

  it('drops a finished transaction 30 days after it finished when the store is restored, and keeps pending ones', () => {
    expect(restored()).toEqual(['pending', 'recent']);
  });

  it('keeps finished transactions for the days the app chooses, or without a term with null', () => {
    expect(restored({ retentionDays: 45 })).toEqual(['noFinish', 'old', 'pending', 'recent']);
    expect(restored({ retentionDays: null })).toEqual(['noFinish', 'old', 'pending', 'recent']);
  });

  it('drops expired transactions when a new one is added', () => {
    const store = createStore();
    setStoreState(store, { transactionsPool: { old: pool.old, pending: pool.pending } });

    store.getState().addTxToPool(createTransaction({ txKey: '0xnew', localTimestamp: now }));

    expect(Object.keys(store.getState().transactionsPool).sort()).toEqual(['0xnew', 'pending']);
  });
});

describe('txTrackingStore onTxFinished', () => {
  const pendingPool = () => ({ [txHash]: createTransaction() });

  it('calls onTxFinished and the subscribers once when a pending transaction reaches a final status', () => {
    const onTxFinished = vi.fn();
    const listener = vi.fn();
    const store = createStore({ onTxFinished });
    store.getState().subscribeTxFinished(listener);
    setStoreState(store, { transactionsPool: pendingPool() });

    store.getState().updateTxParams(txHash, { hash: '0xabc', confirmations: 1 });
    expect(onTxFinished).not.toHaveBeenCalled();

    store.getState().updateTxParams(txHash, { status: TransactionStatus.Success, pending: false });
    // A second tracker of the same transaction (React Strict Mode) writes the same status again
    store.getState().updateTxParams(txHash, { status: TransactionStatus.Success, pending: false });

    expect(onTxFinished).toHaveBeenCalledTimes(1);
    expect(onTxFinished).toHaveBeenCalledWith(
      expect.objectContaining({ txKey: txHash, hash: '0xabc', status: TransactionStatus.Success, pending: false }),
    );
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(onTxFinished.mock.calls[0][0]);
  });

  it.each([TransactionStatus.Failed, TransactionStatus.Replaced])('fires for %s as well', (status) => {
    const onTxFinished = vi.fn();
    const store = createStore({ onTxFinished });
    setStoreState(store, { transactionsPool: pendingPool() });

    store.getState().updateTxParams(txHash, { status, pending: false });

    expect(onTxFinished).toHaveBeenCalledWith(expect.objectContaining({ status }));
  });

  it('fires for a transaction that a tracker restarted after a reload finishes', async () => {
    const onTxFinished = vi.fn();
    const adapter = createAdapter({
      checkAndInitializeTrackerInStore: vi.fn(async ({ tx, updateTxParams }) => {
        updateTxParams(tx.txKey, { status: TransactionStatus.Success, pending: false });
      }),
    });
    const store = createStore({ adapter, onTxFinished });
    setStoreState(store, { transactionsPool: pendingPool() });

    await store.getState().initializeTransactionsPool();

    expect(onTxFinished).toHaveBeenCalledTimes(1);
    expect(onTxFinished).toHaveBeenCalledWith(expect.objectContaining({ status: TransactionStatus.Success }));
  });

  it('fires when a remote backend reports a pending transaction as finished, and not for one that already was', async () => {
    const onTxFinished = vi.fn();
    const store = createStore({ onTxFinished });
    setStoreState(store, {
      transactionsPool: {
        ...pendingPool(),
        '0xdone': createTransaction({ txKey: '0xdone', pending: false, status: TransactionStatus.Success }),
      },
    });

    await store
      .getState()
      .injectExternalPendingTxs([
        createTransaction({ pending: false, status: TransactionStatus.Failed, finishedTimestamp: 2 }),
        createTransaction({ txKey: '0xdone', pending: false, status: TransactionStatus.Success }),
      ]);

    expect(onTxFinished).toHaveBeenCalledTimes(1);
    expect(onTxFinished).toHaveBeenCalledWith(
      expect.objectContaining({ txKey: txHash, status: TransactionStatus.Failed, pending: false }),
    );
  });

  it('records the status and calls the other listeners when a listener throws or rejects', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const store = createStore({
      onTxFinished: () => {
        throw new Error('sync failure');
      },
    });
    const rejecting = vi.fn().mockRejectedValue(new Error('async failure'));
    const last = vi.fn();
    store.getState().subscribeTxFinished(rejecting);
    store.getState().subscribeTxFinished(last);
    setStoreState(store, { transactionsPool: pendingPool() });

    expect(() =>
      store.getState().updateTxParams(txHash, { status: TransactionStatus.Success, pending: false }),
    ).not.toThrow();

    expect(store.getState().transactionsPool[txHash].status).toBe(TransactionStatus.Success);
    expect(rejecting).toHaveBeenCalledTimes(1);
    expect(last).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => expect(consoleError).toHaveBeenCalledTimes(2));
    consoleError.mockRestore();
  });

  it('stops calling a listener after it unsubscribes', () => {
    const listener = vi.fn();
    const store = createStore();
    const unsubscribe = store.getState().subscribeTxFinished(listener);
    unsubscribe();
    setStoreState(store, { transactionsPool: pendingPool() });

    store.getState().updateTxParams(txHash, { status: TransactionStatus.Success, pending: false });

    expect(listener).not.toHaveBeenCalled();
  });

  it('does not fire for finished transactions restored from storage', async () => {
    const onTxFinished = vi.fn();
    const storage = createMemoryStorage();
    storage.setItem(
      'finished',
      JSON.stringify({
        state: {
          transactionsPool: {
            [txHash]: createTransaction({ pending: false, status: TransactionStatus.Success, localTimestamp: 9e9 }),
          },
        },
        version: 0,
      }),
    );
    const store = createStore({ name: 'finished', storage: createJSONStorage(() => storage), onTxFinished });

    await store.getState().initializeTransactionsPool();

    expect(store.getState().transactionsPool[txHash].status).toBe(TransactionStatus.Success);
    expect(onTxFinished).not.toHaveBeenCalled();
  });

  it('fires before the callbacks of the transaction itself', async () => {
    const order: string[] = [];
    const adapter = createAdapter({
      checkAndInitializeTrackerInStore: vi.fn(async ({ tx, updateTxParams, onSuccess }) => {
        updateTxParams(tx.txKey, { status: TransactionStatus.Success, pending: false });
        await onSuccess?.({ ...tx, status: TransactionStatus.Success, pending: false });
      }),
    });
    const store = createStore({ adapter, onTxFinished: () => void order.push('onTxFinished') });

    await store.getState().executeTxAction({
      actionFunction: async () => txHash,
      params: createValidParams(),
      onSuccess: () => void order.push('onSuccess'),
    });

    expect(order).toEqual(['onTxFinished', 'onSuccess']);
  });
});

describe('txTrackingStore pool limit', () => {
  const finishedTx = (txKey: string, localTimestamp: number) =>
    createTransaction({
      txKey,
      localTimestamp,
      pending: false,
      status: TransactionStatus.Success,
      finishedTimestamp: 9e9,
    });
  const pendingTx = (txKey: string, localTimestamp: number) => createTransaction({ txKey, localTimestamp });

  it('never evicts a transaction that is still pending, even past maxTransactions', async () => {
    const store = createStore({ maxTransactions: 2 });
    setStoreState(store, { transactionsPool: { a: pendingTx('a', 1), b: pendingTx('b', 2) } });

    await store.getState().addTxToPool(pendingTx('c', 3));

    expect(Object.keys(store.getState().transactionsPool).sort()).toEqual(['a', 'b', 'c']);
  });

  it('evicts the oldest finished transaction first and keeps an older pending one', async () => {
    const store = createStore({ maxTransactions: 3 });
    setStoreState(store, {
      transactionsPool: {
        pending: pendingTx('pending', 1),
        old: finishedTx('old', 2),
        recent: finishedTx('recent', 3),
      },
    });

    await store.getState().addTxToPool(pendingTx('new', 4));

    expect(Object.keys(store.getState().transactionsPool).sort()).toEqual(['new', 'pending', 'recent']);
  });

  it('shrinks back to maxTransactions once the transactions that held it over have finished', async () => {
    const store = createStore({ maxTransactions: 2 });
    setStoreState(store, {
      transactionsPool: { a: finishedTx('a', 1), b: finishedTx('b', 2), c: finishedTx('c', 3) },
    });

    await store.getState().addTxToPool(pendingTx('d', 4));

    expect(Object.keys(store.getState().transactionsPool).sort()).toEqual(['c', 'd']);
  });

  it('still calls the finished event for a transaction tracked while the pool was over the limit', async () => {
    const onTxFinished = vi.fn();
    const store = createStore({ maxTransactions: 1, onTxFinished });
    setStoreState(store, { transactionsPool: { a: pendingTx('a', 1) } });

    await store.getState().addTxToPool(pendingTx('b', 2));
    store.getState().updateTxParams('a', { status: TransactionStatus.Success, pending: false });

    expect(onTxFinished).toHaveBeenCalledWith(
      expect.objectContaining({ txKey: 'a', status: TransactionStatus.Success }),
    );
  });
});
