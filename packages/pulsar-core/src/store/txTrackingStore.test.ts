import { OrbitAdapter } from '@tuwaio/orbit-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
  // A Retry comes back through an adapter with the action of the first call and nothing else of it: the next step of an app
  // never ran, and its session check was skipped
  it('a Retry keeps the callbacks and the check of the call it repeats, and no function reaches the record', async () => {
    const adapter = createAdapter();
    const store = createStore({ adapter });
    const first = vi.fn().mockRejectedValue(new Error('reverted'));
    const onSuccess = vi.fn();
    const beforeTxProcess = vi.fn();

    await expect(
      store.getState().executeTxAction({
        actionFunction: first,
        params: createValidParams(),
        onSuccess,
        beforeTxProcess,
      }),
    ).rejects.toThrow('reverted');
    expect(beforeTxProcess).toHaveBeenCalledTimes(1);

    await store.getState().executeTxAction({
      actionFunction: vi.fn().mockResolvedValue(txHash),
      params: { ...createValidParams(), actionFunction: first } as ReturnType<typeof createValidParams>,
    });

    expect(beforeTxProcess).toHaveBeenCalledTimes(2);
    const tx = store.getState().transactionsPool[txHash];
    expect(tx).toBeDefined();
    expect(tx).not.toHaveProperty('actionFunction');
    const tracked = vi.mocked(adapter.checkAndInitializeTrackerInStore).mock.lastCall?.[0];
    tracked?.onSuccess?.(tx);
    expect(onSuccess).toHaveBeenCalledWith(tx);
  });

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

  it('never sends pimlicoApiKey, or the gelatoApiKey of a record an older version saved, to onRemoteCreate', async () => {
    const onRemoteCreate = vi.fn().mockResolvedValue(undefined);
    const store = createStore({ onRemoteCreate });

    await store.getState().addTxToPool({
      ...createTransaction(),
      pimlicoApiKey: 'pim_secret',
      bundlerUrl: 'https://bundler.example',
      gelatoApiKey: 'gelato_secret',
      rpcUrl: 'https://rpc.example/secret-key',
    } as EvmTransaction);

    await vi.waitFor(() => expect(onRemoteCreate).toHaveBeenCalledTimes(1));
    const sentTx = onRemoteCreate.mock.calls[0][0] as Record<string, unknown>;
    expect(sentTx).not.toHaveProperty('pimlicoApiKey');
    expect(sentTx).not.toHaveProperty('gelatoApiKey');
    // On a record an older version saved: an endpoint can hold a key
    expect(sentTx).not.toHaveProperty('rpcUrl');
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

describe('final statuses and trackers', () => {
  const pendingTx = (txKey = txHash) =>
    ({
      txKey,
      adapter: OrbitAdapter.EVM,
      tracker: TransactionTracker.Ethereum,
      chainId: 1,
      pending: true,
      from: '0x0000000000000000000000000000000000000001',
      type: 'test',
      localTimestamp: Math.floor(Date.now() / 1000),
      connectorType: 'evm:injected',
    }) as unknown as EvmTransaction;

  function createTestStore(adapter = createAdapter(), name = 'final-status-test') {
    return {
      adapter,
      store: createPulsarStore<EvmTransaction>({
        name,
        adapter,
        storage: createJSONStorage(() => createMemoryStorage()),
      }),
    };
  }

  it('keeps a final status against a late writer: a tracker that lost sight must not overwrite the result', async () => {
    const { store } = createTestStore();
    await store.getState().addTxToPool(pendingTx());

    store.getState().updateTxParams(txHash, {
      status: TransactionStatus.Replaced,
      replacedTxHash: '0xabc',
      replacedReason: 'repriced',
      pending: false,
      finishedTimestamp: 2_000_000_000,
    });
    store.getState().updateTxParams(txHash, {
      status: TransactionStatus.Failed,
      isError: true,
      pending: true,
      replacedTxHash: '0xdef',
      replacedReason: 'unknown',
      finishedTimestamp: 2_000_000_001,
      error: { message: 'Timed out' } as never,
    });

    const tx = store.getState().transactionsPool[txHash] as EvmTransaction;
    expect(tx.status).toBe(TransactionStatus.Replaced);
    expect(tx.isError).toBeUndefined();
    expect(tx.pending).toBe(false);
    expect(tx.replacedTxHash).toBe('0xabc');
    expect(tx.replacedReason).toBe('repriced');
    expect(tx.finishedTimestamp).toBe(2_000_000_000);
    expect(tx.error).toBeUndefined();
  });

  it('still writes the other fields of a finished transaction', async () => {
    const { store } = createTestStore();
    await store.getState().addTxToPool(pendingTx());

    store.getState().updateTxParams(txHash, { status: TransactionStatus.Success, pending: false });
    store.getState().updateTxParams(txHash, { isTrackedModalOpen: true, confirmations: 12 });

    const tx = store.getState().transactionsPool[txHash] as EvmTransaction;
    expect(tx.isTrackedModalOpen).toBe(true);
    expect(tx.confirmations).toBe(12);
    expect(tx.status).toBe(TransactionStatus.Success);
  });

  it('starts one tracker per transaction: a second one would share and then lose the watcher of the first', async () => {
    const { store, adapter } = createTestStore();
    await store.getState().addTxToPool(pendingTx());

    await store.getState().initializeTransactionsPool();
    await store.getState().initializeTransactionsPool();

    expect(adapter.checkAndInitializeTrackerInStore).toHaveBeenCalledOnce();
  });

  it('starts the tracker again when the first one could not start', async () => {
    const adapter = createAdapter({
      checkAndInitializeTrackerInStore: vi
        .fn()
        .mockRejectedValueOnce(new Error('wallet not ready'))
        .mockResolvedValue(undefined),
    });
    const { store } = createTestStore(adapter);
    await store.getState().addTxToPool(pendingTx());

    await expect(store.getState().initializeTransactionsPool()).rejects.toThrow('wallet not ready');
    await store.getState().initializeTransactionsPool();

    expect(adapter.checkAndInitializeTrackerInStore).toHaveBeenCalledTimes(2);
  });

  it('does not track twice a transaction injected while it is already tracked', async () => {
    const { store, adapter } = createTestStore();
    await store.getState().injectExternalPendingTxs([pendingTx('0xfeed')]);
    await store.getState().initializeTransactionsPool();

    expect(adapter.checkAndInitializeTrackerInStore).toHaveBeenCalledOnce();
  });

  it('a transaction whose tracking was stopped does not come back from a page of the history', async () => {
    const { store, adapter } = createTestStore();
    await store.getState().injectExternalPendingTxs([pendingTx('0xfeed')]);
    vi.mocked(adapter.checkAndInitializeTrackerInStore).mockClear();

    store.getState().removeTxFromPool('0xfeed');
    await store.getState().injectExternalPendingTxs([pendingTx('0xfeed')]);

    expect(store.getState().transactionsPool['0xfeed']).toBeUndefined();
    expect(adapter.checkAndInitializeTrackerInStore).not.toHaveBeenCalled();
  });

  function twoTabs() {
    const listeners: ((event: { key: string | null }) => void)[] = [];
    vi.stubGlobal('window', {
      addEventListener: (type: string, listener: (event: { key: string | null }) => void) => {
        if (type === 'storage') listeners.push(listener);
      },
    });
    const memory = createMemoryStorage();
    const adapter = createAdapter();
    const make = () =>
      createPulsarStore<EvmTransaction>({ name: 'tabs-test', adapter, storage: createJSONStorage(() => memory) });
    const here = make();
    const there = make();
    const hear = async (key: string | null = 'tabs-test') => {
      listeners[0]({ key });
      await new Promise((resolve) => setImmediate(resolve));
    };
    return { here, there, adapter, hear };
  }

  describe('another tab of the same store', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('learns what the other tab added, and tracks what is pending', async () => {
      const { here, there, adapter, hear } = twoTabs();
      await there.getState().addTxToPool(pendingTx());

      await hear('another-key');
      expect(here.getState().transactionsPool[txHash]).toBeUndefined();

      await hear();
      expect(here.getState().transactionsPool[txHash]).toBeDefined();
      expect(adapter.checkAndInitializeTrackerInStore).toHaveBeenCalledOnce();
    });

    it('keeps its own pending transaction when a stale copy of the pool lacks it', async () => {
      const { here, there, hear } = twoTabs();
      await there.getState().addTxToPool(pendingTx('0xother'));
      await here.getState().addTxToPool(pendingTx('0xmine'));

      // The other tab saves its copy, written before it heard of 0xmine
      there.getState().updateTxParams('0xother', { nonce: 5 });
      await hear();

      expect(here.getState().transactionsPool['0xmine']?.pending).toBe(true);
    });

    it('does not take a final status back to pending from a stale copy', async () => {
      const { here, there, hear } = twoTabs();
      await there.getState().addTxToPool(pendingTx());
      await hear();
      here.getState().updateTxParams(txHash, { status: TransactionStatus.Success, pending: false });

      there.getState().updateTxParams(txHash, { nonce: 5 });
      await hear();

      expect(here.getState().transactionsPool[txHash]?.status).toBe(TransactionStatus.Success);
    });

    // The pool grew past maxTransactions: a tab brought back what another had evicted
    it('keeps the pool within its limit when the other tab brings more', async () => {
      const listeners: ((event: { key: string | null }) => void)[] = [];
      vi.stubGlobal('window', {
        addEventListener: (type: string, listener: (event: { key: string | null }) => void) => {
          if (type === 'storage') listeners.push(listener);
        },
      });
      const memory = createMemoryStorage();
      const make = (maxTransactions: number) =>
        createPulsarStore<EvmTransaction>({
          name: 'tabs-limit',
          adapter: createAdapter(),
          maxTransactions,
          storage: createJSONStorage(() => memory),
        });
      const here = make(2);
      const there = make(50);
      for (const [index, key] of ['0x1', '0x2', '0x3'].entries()) {
        await there
          .getState()
          .addTxToPool(createTransaction({ txKey: key, localTimestamp: Math.floor(Date.now() / 1000) + index }));
        there.getState().updateTxParams(key, { status: TransactionStatus.Success, pending: false });
      }
      listeners[0]({ key: 'tabs-limit' });
      await new Promise((resolve) => setImmediate(resolve));
      expect(Object.keys(here.getState().transactionsPool).sort()).toEqual(['0x2', '0x3']);
    });

    it('a reverted replacement heard from the other tab calls onError too', async () => {
      const { here, there, hear } = twoTabs();
      const onError = vi.fn();
      const onReplaced = vi.fn();
      await here.getState().executeTxAction({
        actionFunction: async () => txHash,
        params: createValidParams(),
        defaultTracker: TransactionTracker.Ethereum,
        onError,
        onReplaced,
      } as never);
      await there.getState().addTxToPool(createTransaction({ txKey: txHash }));
      there.getState().updateTxParams(txHash, {
        status: TransactionStatus.Replaced,
        pending: false,
        isError: true,
        replacedReason: 'replaced',
        replacedTxHash: '0xnew',
        finishedTimestamp: Math.floor(Date.now() / 1000),
      } as never);
      await hear();
      expect(onReplaced).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('fires the finished event once for a result that came from the other tab', async () => {
      const { here, there, hear } = twoTabs();
      const listener = vi.fn();
      here.getState().subscribeTxFinished(listener);
      await there.getState().addTxToPool(pendingTx());
      await hear();

      there.getState().updateTxParams(txHash, { status: TransactionStatus.Success, pending: false });
      await hear();
      expect(listener).toHaveBeenCalledOnce();

      // Its own tracker gets the same receipt a poll later
      here.getState().updateTxParams(txHash, { status: TransactionStatus.Success, pending: false });
      expect(listener).toHaveBeenCalledOnce();
    });

    it('runs the callbacks of the sending tab for a result another tab read first', async () => {
      const { here, there, adapter, hear } = twoTabs();
      const onSuccess = vi.fn();
      await here.getState().executeTxAction({
        actionFunction: async () => txHash,
        params: { adapter: OrbitAdapter.EVM, desiredChainID: 1, title: 't', description: 'd', type: 'T' },
        onSuccess,
      });
      const started = vi.mocked(adapter.checkAndInitializeTrackerInStore).mock.calls[0][0];
      await there.persist.rehydrate();

      there.getState().updateTxParams(txHash, { status: TransactionStatus.Success, pending: false });
      await hear();
      expect(onSuccess).toHaveBeenCalledOnce();

      // Its own tracker reports the same receipt a moment later: the callback does not run twice
      void started.onSuccess?.(started.tx);
      expect(onSuccess).toHaveBeenCalledOnce();
    });

    it('hands the callbacks to the new record when another tab saw the speed-up first', async () => {
      const { here, there, adapter, hear } = twoTabs();
      const onSuccess = vi.fn();
      await here.getState().executeTxAction({
        actionFunction: async () => txHash,
        params: { adapter: OrbitAdapter.EVM, desiredChainID: 1, title: 't', description: 'd', type: 'T' },
        onSuccess,
      });
      await there.persist.rehydrate();

      there.getState().updateTxParams(txHash, {
        status: TransactionStatus.Replaced,
        replacedTxHash: '0xnew' as never,
        replacedReason: 'repriced',
        pending: false,
      });
      await new Promise((resolve) => setImmediate(resolve));
      await hear();

      const next = vi
        .mocked(adapter.checkAndInitializeTrackerInStore)
        .mock.calls.filter((c) => c[0].tx.txKey === '0xnew');
      const inThisTab = next[next.length - 1][0];
      void inThisTab.onSuccess?.(inThisTab.tx);
      expect(onSuccess).toHaveBeenCalledOnce();
    });

    it('the modal of this tab goes on with the new record when another tab saw the speed-up first', async () => {
      const { here, there, hear } = twoTabs();
      await here.getState().executeTxAction({
        actionFunction: async () => txHash,
        params: {
          adapter: OrbitAdapter.EVM,
          desiredChainID: 1,
          title: 't',
          description: 'd',
          type: 'T',
          withTrackedModal: true,
        },
      });
      await there.persist.rehydrate();
      there.getState().closeTxTrackedModal(txHash);

      there.getState().updateTxParams(txHash, {
        status: TransactionStatus.Replaced,
        replacedTxHash: '0xnew' as never,
        replacedReason: 'repriced',
        pending: false,
      });
      await new Promise((resolve) => setImmediate(resolve));
      await hear();

      const state = here.getState();
      expect(state.transactionsPool['0xnew']).toBeDefined();
      expect(state.initialTx?.lastTxKey).toBe('0xnew');
      expect(state.lastAddedTxKey).toBe('0xnew');
      expect(state.transactionsPool['0xnew'].isTrackedModalOpen).toBe(true);
      expect(state.transactionsPool[txHash].isTrackedModalOpen).toBe(false);
    });

    it('a record removed here does not come back from the next save of the other tab', async () => {
      const { here, there, hear } = twoTabs();
      await there.getState().addTxToPool(pendingTx());
      await hear();
      here.getState().removeTxFromPool(txHash);

      there.getState().updateTxParams(txHash, { nonce: 5 });
      await hear();

      expect(here.getState().transactionsPool[txHash]).toBeUndefined();
    });

    it('does not take the last added key of the other tab: this tab follows its own transaction', async () => {
      const { here, there, hear } = twoTabs();
      await here.getState().addTxToPool(pendingTx('0xmine'));
      await there.getState().addTxToPool(pendingTx('0xother'));

      await hear();

      expect(here.getState().getLastTxKey()).toBe('0xmine');
    });
  });

  it('works where window has no addEventListener', () => {
    vi.stubGlobal('window', { localStorage: {} });
    try {
      expect(() => createTestStore(createAdapter(), 'no-listener-test')).not.toThrow();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('lets the chain correct a Failed, and says so again', async () => {
    const onTxFinished = vi.fn();
    const store = createStore({ onTxFinished });
    await store.getState().addTxToPool(pendingTx());

    store.getState().updateTxParams(txHash, {
      status: TransactionStatus.Failed,
      pending: false,
      isError: true,
      error: { message: 'Timed out' } as never,
    });
    store.getState().updateTxParams(txHash, { status: TransactionStatus.Success, pending: false, isError: false });

    const tx = store.getState().transactionsPool[txHash] as EvmTransaction;
    expect(tx.status).toBe(TransactionStatus.Success);
    expect(tx.error).toBeUndefined();
    expect(onTxFinished).toHaveBeenCalledTimes(2);
  });

  it('does not copy a server Failed over a running tracker: the chain answers it', async () => {
    const { store } = createTestStore();
    await store.getState().addTxToPool(pendingTx());
    await store.getState().initializeTransactionsPool();

    await store
      .getState()
      .injectExternalPendingTxs([{ ...pendingTx(), pending: false, status: TransactionStatus.Failed }]);

    expect(store.getState().transactionsPool[txHash]?.pending).toBe(true);
    store.getState().updateTxParams(txHash, { status: TransactionStatus.Success, pending: false });
    expect(store.getState().transactionsPool[txHash]?.status).toBe(TransactionStatus.Success);
  });

  it('copies the result of a server onto a transaction nothing tracks', async () => {
    const { store } = createTestStore();
    await store.getState().addTxToPool(pendingTx());

    await store.getState().injectExternalPendingTxs([
      {
        ...pendingTx(),
        pending: false,
        status: TransactionStatus.Replaced,
        replacedTxHash: '0xabc',
        replacedReason: 'repriced',
      } as EvmTransaction,
    ]);

    const tx = store.getState().transactionsPool[txHash] as EvmTransaction;
    expect(tx.status).toBe(TransactionStatus.Replaced);
    expect(tx.replacedTxHash).toBe('0xabc');
    expect(tx.replacedReason).toBe('repriced');
  });

  it('tracks a key again once its transaction has finished: a Safe can propose the same hash again', async () => {
    const { store, adapter } = createTestStore();
    await store.getState().addTxToPool(pendingTx());
    await store.getState().initializeTransactionsPool();
    store.getState().updateTxParams(txHash, { status: TransactionStatus.Failed, pending: false });
    expect(store.getState().isTxTracked(txHash)).toBe(false);

    await store.getState().addTxToPool(pendingTx());
    await store.getState().initializeTransactionsPool();

    expect(adapter.checkAndInitializeTrackerInStore).toHaveBeenCalledTimes(2);
  });

  it('removing a transaction still deletes it from the pool, and only that stops its tracker', async () => {
    const { store } = createTestStore();
    await store.getState().addTxToPool(pendingTx());
    await store.getState().initializeTransactionsPool();

    store.getState().removeTxFromPool(txHash);

    expect(store.getState().transactionsPool[txHash]).toBeUndefined();
    expect(store.getState().isTxTracked(txHash)).toBe(false);
  });

  it('a replaced record older than the retention term is dropped like any other, and the new record stays', async () => {
    const { store } = createTestStore();
    await store.getState().addTxToPool({ ...pendingTx(), localTimestamp: 1_000_000_000 });

    store.getState().updateTxParams(txHash, {
      status: TransactionStatus.Replaced,
      replacedTxHash: '0xnew',
      replacedReason: 'repriced',
      pending: false,
    });

    expect(store.getState().transactionsPool['0xnew']?.pending).toBe(true);
  });

  it('a finished transaction stays in the pool: finishing releases the tracker, never the record', async () => {
    const { store } = createTestStore();
    await store.getState().addTxToPool(pendingTx());
    await store.getState().initializeTransactionsPool();

    store.getState().updateTxParams(txHash, { status: TransactionStatus.Success, pending: false });

    expect(store.getState().transactionsPool[txHash]?.status).toBe(TransactionStatus.Success);
    expect(store.getState().isTxTracked(txHash)).toBe(false);
  });

  it('a removed transaction is no longer tracked, so its tracker can stop', async () => {
    const { store } = createTestStore();
    await store.getState().addTxToPool(pendingTx());
    await store.getState().initializeTransactionsPool();
    expect(store.getState().isTxTracked(txHash)).toBe(true);

    store.getState().removeTxFromPool(txHash);

    expect(store.getState().isTxTracked(txHash)).toBe(false);
  });
});

// Owner, 2026-11-07: "Stop tracking" lasted until the next page load. The list was in memory, while the server keeps a pending row
// for up to a day and another tab keeps its copy: the record came back with a tracker and a toast, for what a person had put away
describe('a transaction a person stopped tracking', () => {
  const NAME = 'stop-tracking-test';
  const KEY = '0xstopped';
  const WALLET = '0x0000000000000000000000000000000000000001';
  const pending = (txKey = KEY) =>
    ({
      txKey,
      hash: txKey,
      adapter: OrbitAdapter.EVM,
      tracker: TransactionTracker.Ethereum,
      from: WALLET,
      type: 'T',
      chainId: 1,
      nonce: 1,
      to: WALLET,
      value: '0',
      pending: true,
      localTimestamp: Math.floor(Date.now() / 1000),
    }) as unknown as EvmTransaction;

  let saved: Map<string, string>;
  let listeners: ((event: { key: string | null }) => void)[];
  let adapter: TxAdapter<EvmTransaction>;
  let state: ReturnType<typeof createMemoryStorage>;
  const openPage = () =>
    createPulsarStore<EvmTransaction>({ name: NAME, adapter, storage: createJSONStorage(() => state) } as StoreConfig);

  beforeEach(() => {
    saved = new Map();
    listeners = [];
    adapter = createAdapter();
    state = createMemoryStorage();
    vi.stubGlobal('window', {
      addEventListener: (type: string, listener: (event: { key: string | null }) => void) => {
        if (type === 'storage') listeners.push(listener);
      },
    });
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => saved.set(key, value),
      removeItem: (key: string) => saved.delete(key),
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('stays stopped after a page load, when the history brings its pending row again', async () => {
    const before = openPage();
    await before.getState().addTxToPool(pending());
    before.getState().removeTxFromPool(KEY);
    vi.mocked(adapter.checkAndInitializeTrackerInStore).mockClear();

    const after = openPage();
    await after.getState().injectExternalPendingTxs([pending()]);

    expect(after.getState().transactionsPool[KEY]).toBeUndefined();
    expect(adapter.checkAndInitializeTrackerInStore).not.toHaveBeenCalled();
    expect(after.getState().isTxRemoved(KEY)).toBe(true);
  });

  it('stays stopped after a page load, when another tab has saved its copy', async () => {
    const here = openPage();
    const there = openPage();
    await there.getState().addTxToPool(pending());
    here.getState().removeTxFromPool(KEY);
    there.getState().updateTxParams(KEY, { nonce: 5 });

    const after = openPage();

    expect(after.getState().transactionsPool[KEY]).toBeUndefined();
  });

  it('another tab lets go of it as well', async () => {
    const here = openPage();
    const there = openPage();
    await there.getState().addTxToPool(pending());
    await there.getState().initializeTransactionsPool();
    expect(there.getState().isTxTracked(KEY)).toBe(true);

    here.getState().removeTxFromPool(KEY);
    listeners[1]({ key: `${NAME}:removedTxKeys` });

    expect(there.getState().transactionsPool[KEY]).toBeUndefined();
    expect(there.getState().isTxTracked(KEY)).toBe(false);
  });

  it('leaves the others alone, in every tab', async () => {
    const here = openPage();
    const there = openPage();
    await there.getState().addTxToPool(pending());
    await there.getState().addTxToPool(pending('0xother'));

    here.getState().removeTxFromPool(KEY);
    listeners[1]({ key: `${NAME}:removedTxKeys` });

    expect(there.getState().transactionsPool['0xother']).toBeDefined();
    expect(openPage().getState().transactionsPool['0xother']).toBeDefined();
  });

  // A Safe proposes the same hash again
  it('counts again when the same key is sent anew, also after a page load', async () => {
    const page = openPage();
    await page.getState().addTxToPool(pending());
    page.getState().removeTxFromPool(KEY);

    await page.getState().executeTxAction({
      actionFunction: async () => KEY as never,
      params: { adapter: OrbitAdapter.EVM, desiredChainID: 1, title: 't', description: 'd', type: 'T' },
    });

    expect(page.getState().isTxRemoved(KEY)).toBe(false);
    expect(openPage().getState().isTxRemoved(KEY)).toBe(false);
  });

  it('keeps the latest fifty: nothing else ever clears them', () => {
    const page = openPage();
    for (let i = 0; i < 60; i += 1) page.getState().removeTxFromPool(`0x${i}`);

    const after = openPage();
    expect(after.getState().isTxRemoved('0x59')).toBe(true);
    expect(after.getState().isTxRemoved('0x10')).toBe(true);
    expect(after.getState().isTxRemoved('0x9')).toBe(false);
  });

  it('holds for the page where the storage is closed, and throws nothing', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('The storage is closed');
      },
      setItem: () => {
        throw new Error('The storage is closed');
      },
    });
    const page = openPage();
    await page.getState().addTxToPool(pending());

    expect(() => page.getState().removeTxFromPool(KEY)).not.toThrow();
    await page.getState().injectExternalPendingTxs([pending()]);

    expect(page.getState().transactionsPool[KEY]).toBeUndefined();
  });

  it('ignores what is not a list in the storage', () => {
    saved.set(`${NAME}:removedTxKeys`, '{"not":"a list"}');

    expect(openPage().getState().isTxRemoved(KEY)).toBe(false);
  });

  it('saves the list apart from the state, so that a save of another tab cannot undo it', async () => {
    const page = openPage();
    await page.getState().addTxToPool(pending());
    page.getState().removeTxFromPool(KEY);

    expect(JSON.parse(saved.get(`${NAME}:removedTxKeys`)!)).toEqual([KEY]);
  });
});

describe('a speed-up continues in a new record', () => {
  const OLD = '0xold';
  const NEW = '0xnew';
  const WALLET = '0x0000000000000000000000000000000000000001';

  const original = (fields: Partial<EvmTransaction> = {}) =>
    ({
      txKey: OLD,
      hash: OLD,
      adapter: OrbitAdapter.EVM,
      tracker: TransactionTracker.Ethereum,
      chainId: 1,
      pending: true,
      from: WALLET,
      sender: WALLET,
      nonce: 7,
      type: 'SWAP',
      title: 'Swap',
      description: 'Swap tokens',
      localTimestamp: Math.floor(Date.now() / 1000),
      connectorType: 'evm:metamask',
      ...fields,
    }) as unknown as EvmTransaction;

  const spedUp = {
    status: TransactionStatus.Replaced,
    replacedTxHash: NEW,
    replacedReason: 'repriced',
    pending: false,
  };

  async function tracked(overrides: Partial<StoreConfig> = {}) {
    const adapter = createAdapter();
    const store = createStore({ adapter, ...overrides });
    await store.getState().addTxToPool(original());
    await store.getState().initializeTransactionsPool();
    return { store, adapter };
  }

  it('keeps the old record as Replaced and adds the new one, pending, with the same meaning', async () => {
    const { store } = await tracked();

    store.getState().updateTxParams(OLD, spedUp as never);

    const pool = store.getState().transactionsPool as Record<string, EvmTransaction>;
    expect(pool[OLD].status).toBe(TransactionStatus.Replaced);
    expect(pool[OLD].replacedTxHash).toBe(NEW);
    expect(pool[NEW].pending).toBe(true);
    expect(pool[NEW].status).toBeUndefined();
    expect(pool[NEW].hash).toBe(NEW);
    expect(pool[NEW].replaces).toBe(OLD);
    expect(pool[NEW].title).toBe('Swap');
    expect(pool[NEW].type).toBe('SWAP');
    expect(pool[NEW].replacedTxHash).toBeUndefined();
    expect(pool[NEW].replacedReason).toBeUndefined();
    expect(pool[NEW].tracker).toBe(TransactionTracker.Ethereum);
  });

  it('tracks the new record to its own result', async () => {
    const { store, adapter } = await tracked();

    store.getState().updateTxParams(OLD, spedUp as never);
    await new Promise((resolve) => setImmediate(resolve));

    expect(adapter.checkAndInitializeTrackerInStore).toHaveBeenCalledTimes(2);
    const started = vi.mocked(adapter.checkAndInitializeTrackerInStore).mock.lastCall?.[0];
    expect(started?.tx.txKey).toBe(NEW);
    expect(store.getState().isTxTracked(NEW)).toBe(true);
    expect(store.getState().isTxTracked(OLD)).toBe(false);
  });

  it('hands the callbacks of executeTxAction on: onSuccess must fire when the operation really succeeded', async () => {
    const adapter = createAdapter();
    const store = createStore({ adapter });
    const onSuccess = vi.fn();
    const onError = vi.fn();
    await store.getState().executeTxAction({
      actionFunction: async () => OLD,
      params: createValidParams(),
      onSuccess,
      onError,
    });

    store.getState().updateTxParams(OLD, spedUp as never);
    await new Promise((resolve) => setImmediate(resolve));

    const started = vi.mocked(adapter.checkAndInitializeTrackerInStore).mock.lastCall?.[0];
    expect(started?.tx.txKey).toBe(NEW);
    void started?.onSuccess?.(started.tx);
    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0].txKey).toBe(NEW);
    expect(onError).not.toHaveBeenCalled();
  });

  it('the replaced record still gets onReplaced, once', async () => {
    const adapter = createAdapter();
    const store = createStore({ adapter });
    const onReplaced = vi.fn();
    await store
      .getState()
      .executeTxAction({ actionFunction: async () => OLD, params: createValidParams(), onReplaced });
    const first = vi.mocked(adapter.checkAndInitializeTrackerInStore).mock.calls[0][0];

    store.getState().updateTxParams(OLD, spedUp as never);
    void first.onReplaced?.(store.getState().transactionsPool[OLD], first.tx);
    void first.onReplaced?.(store.getState().transactionsPool[OLD], first.tx);

    expect(onReplaced).toHaveBeenCalledOnce();
  });

  it('a callback runs once though its result reaches this tab twice', async () => {
    const adapter = createAdapter();
    const store = createStore({ adapter });
    const onSuccess = vi.fn();
    await store.getState().executeTxAction({ actionFunction: async () => OLD, params: createValidParams(), onSuccess });
    const started = vi.mocked(adapter.checkAndInitializeTrackerInStore).mock.calls[0][0];

    await store
      .getState()
      .injectExternalPendingTxs([
        { ...original(), pending: false, status: TransactionStatus.Success } as unknown as EvmTransaction,
      ]);
    void started.onSuccess?.(started.tx);

    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('a throwing callback is logged and changes nothing', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const adapter = createAdapter();
    const store = createStore({ adapter });
    await store.getState().executeTxAction({
      actionFunction: async () => OLD,
      params: createValidParams(),
      onSuccess: () => {
        throw new Error('app bug');
      },
    });
    const started = vi.mocked(adapter.checkAndInitializeTrackerInStore).mock.calls[0][0];

    expect(() => started.onSuccess?.(started.tx)).not.toThrow();
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it('a reason-less Replaced from a server does not end a running tracker: the chain says whether a speed-up follows', async () => {
    const { store } = await tracked();

    await store.getState().injectExternalPendingTxs([
      {
        ...original(),
        pending: false,
        status: TransactionStatus.Replaced,
        replacedTxHash: NEW,
      } as unknown as EvmTransaction,
    ]);

    expect(store.getState().transactionsPool[OLD]?.pending).toBe(true);
    expect(store.getState().isTxTracked(OLD)).toBe(true);

    store.getState().updateTxParams(OLD, spedUp as never);
    expect(store.getState().transactionsPool[NEW]?.pending).toBe(true);
  });

  it('a record that never went to the backend has no row to continue: its successor is not synced', async () => {
    const onRemoteCreate = vi.fn().mockResolvedValue(undefined);
    const adapter = createAdapter();
    const store = createStore({ adapter, onRemoteCreate });
    setStoreState(store, { transactionsPool: { [OLD]: original() } });
    await store.getState().initializeTransactionsPool();

    store.getState().updateTxParams(OLD, spedUp as never);
    await new Promise((resolve) => setImmediate(resolve));

    expect(onRemoteCreate).not.toHaveBeenCalled();
    expect((store.getState().transactionsPool[NEW] as EvmTransaction).syncStatus).toBeUndefined();
  });

  it('the new record says it is in a block, so speed-up and cancel are not offered on it', async () => {
    const { store } = await tracked();

    store.getState().updateTxParams(OLD, spedUp as never);

    expect((store.getState().transactionsPool[NEW] as EvmTransaction).confirmations).toBe(1);
  });

  it('a reorganization that brings the original back reopens it: no two records replaced by each other', async () => {
    const { store, adapter } = await tracked();
    store.getState().updateTxParams(OLD, spedUp as never);
    await new Promise((resolve) => setImmediate(resolve));

    store.getState().updateTxParams(NEW, {
      status: TransactionStatus.Replaced,
      replacedTxHash: OLD as never,
      replacedReason: 'repriced',
      pending: false,
    });
    await new Promise((resolve) => setImmediate(resolve));

    const pool = store.getState().transactionsPool as Record<string, EvmTransaction>;
    expect(pool[OLD].pending).toBe(true);
    expect(pool[OLD].status).toBeUndefined();
    expect(pool[OLD].replacedTxHash).toBeUndefined();
    expect(pool[NEW].status).toBe(TransactionStatus.Replaced);
    expect(vi.mocked(adapter.checkAndInitializeTrackerInStore).mock.lastCall?.[0].tx.txKey).toBe(OLD);
  });

  it('a pending transaction from a remote history is normalized: strings would be refused when sent back', async () => {
    const store = createStore({ adapter: createAdapter() });

    await store
      .getState()
      .injectExternalPendingTxs([
        { ...original(), localTimestamp: '1700000000', appInvoiceId: null } as unknown as EvmTransaction,
      ]);

    const tx = store.getState().transactionsPool[OLD] as unknown as Record<string, unknown>;
    expect(tx.localTimestamp).toBe(1_700_000_000);
    expect('appInvoiceId' in tx).toBe(false);
  });

  it.each([
    ['a cancel: a transfer of nothing to oneself is not the operation', 'cancelled'],
    ['another transaction in the same nonce', 'replaced'],
    ['a spender that could not be found', 'unknown'],
  ])('adds nothing for %s', async (_name, replacedReason) => {
    const { store, adapter } = await tracked();

    store.getState().updateTxParams(OLD, { ...spedUp, replacedReason } as never);
    await new Promise((resolve) => setImmediate(resolve));

    expect(store.getState().transactionsPool[NEW]).toBeUndefined();
    expect(adapter.checkAndInitializeTrackerInStore).toHaveBeenCalledOnce();
  });

  it('adds nothing for a Safe transaction, whose replacement is a safeTxHash with no reason', async () => {
    const { store } = await tracked();

    store.getState().updateTxParams(OLD, { status: TransactionStatus.Replaced, replacedTxHash: NEW, pending: false });

    expect(store.getState().transactionsPool[NEW]).toBeUndefined();
  });

  it('moves the last added key only if it pointed at the old record', async () => {
    const first = await tracked();
    first.store.getState().updateTxParams(OLD, spedUp as never);
    expect(first.store.getState().getLastTxKey()).toBe(NEW);

    const second = await tracked();
    await second.store.getState().addTxToPool(original({ txKey: '0xlater', hash: '0xlater' }));
    second.store.getState().updateTxParams(OLD, spedUp as never);
    expect(second.store.getState().getLastTxKey()).toBe('0xlater');
  });

  it('moves the tracking modal to the new record', async () => {
    const adapter = createAdapter();
    const store = createStore({ adapter });
    await store.getState().executeTxAction({
      actionFunction: async () => OLD,
      params: { ...createValidParams(), withTrackedModal: true } as never,
    });
    expect(store.getState().initialTx?.lastTxKey).toBe(OLD);

    store.getState().updateTxParams(OLD, spedUp as never);

    expect(store.getState().initialTx?.lastTxKey).toBe(NEW);
    expect(store.getState().transactionsPool[NEW]?.isTrackedModalOpen).toBe(true);
    expect(store.getState().transactionsPool[OLD]?.isTrackedModalOpen).toBe(false);
  });

  it('fires the finished event for each record: the replaced one now, the new one at its result', async () => {
    const onTxFinished = vi.fn();
    const { store } = await tracked({ onTxFinished });

    store.getState().updateTxParams(OLD, spedUp as never);
    expect(onTxFinished).toHaveBeenCalledOnce();
    expect(onTxFinished.mock.calls[0][0].txKey).toBe(OLD);

    store.getState().updateTxParams(NEW, { status: TransactionStatus.Success, pending: false });
    expect(onTxFinished).toHaveBeenCalledTimes(2);
    expect(onTxFinished.mock.calls[1][0].txKey).toBe(NEW);
  });

  it('sends the new record to the remote history too', async () => {
    const onRemoteCreate = vi.fn().mockResolvedValue(undefined);
    const { store } = await tracked({ onRemoteCreate });

    store.getState().updateTxParams(OLD, spedUp as never);
    await new Promise((resolve) => setImmediate(resolve));

    expect(onRemoteCreate).toHaveBeenCalledWith(expect.objectContaining({ txKey: NEW, replaces: OLD }));
  });

  it('does not overwrite a record another tab has already added or finished', async () => {
    const { store, adapter } = await tracked();
    await store.getState().addTxToPool(original({ txKey: NEW, hash: NEW }));
    store.getState().updateTxParams(NEW, { status: TransactionStatus.Success, pending: false });
    const calls = vi.mocked(adapter.checkAndInitializeTrackerInStore).mock.calls.length;

    store.getState().updateTxParams(OLD, spedUp as never);
    await new Promise((resolve) => setImmediate(resolve));

    expect(store.getState().transactionsPool[NEW]?.status).toBe(TransactionStatus.Success);
    expect(vi.mocked(adapter.checkAndInitializeTrackerInStore).mock.calls.length).toBe(calls);
  });

  it('after a reload only the new record is tracked again', async () => {
    const adapter = createAdapter();
    const memory = createMemoryStorage();
    const make = () =>
      createPulsarStore<EvmTransaction>({ name: 'follow-reload', adapter, storage: createJSONStorage(() => memory) });
    const before = make();
    await before.getState().addTxToPool(original());
    before.getState().updateTxParams(OLD, spedUp as never);
    vi.mocked(adapter.checkAndInitializeTrackerInStore).mockClear();

    const after = make();
    await after.getState().initializeTransactionsPool();

    expect(adapter.checkAndInitializeTrackerInStore).toHaveBeenCalledOnce();
    expect(vi.mocked(adapter.checkAndInitializeTrackerInStore).mock.lastCall?.[0].tx.txKey).toBe(NEW);
  });

  it('a result a server reports as a speed-up continues the same way', async () => {
    const { store } = await createStoreWithPending();
    await store.getState().injectExternalPendingTxs([{ ...original(), ...spedUp } as unknown as EvmTransaction]);

    expect(store.getState().transactionsPool[NEW]?.pending).toBe(true);
    expect((store.getState().transactionsPool[NEW] as EvmTransaction).replaces).toBe(OLD);
  });

  async function createStoreWithPending() {
    const store = createStore({ adapter: createAdapter() });
    await store.getState().addTxToPool(original());
    return { store };
  }
});

describe('what the audit found in the store', () => {
  // A transaction with no description came back from the history with `description: null`, was refused as invalid, and so
  // never showed, was never tracked and never healed
  it('takes a history row with empty columns, and its numbers as numbers', async () => {
    const store = createStore();
    const row = {
      ...createTransaction({ txKey: '0xrow' }),
      title: null,
      description: null,
      nonce: '7',
      localTimestamp: '100',
    };
    await store.getState().injectExternalPendingTxs([row as unknown as EvmTransaction]);
    const saved = store.getState().transactionsPool['0xrow'] as EvmTransaction;
    expect(saved).toBeDefined();
    expect(saved.title).toBeUndefined();
    expect(saved.nonce).toBe(7);
    expect(saved.localTimestamp).toBe(100);
  });

  const failedHere = async () => {
    const store = createStore();
    await store.getState().addTxToPool(createTransaction({ txKey: '0xfail' }));
    store.getState().updateTxParams('0xfail', {
      status: TransactionStatus.Failed,
      pending: false,
      isError: true,
      error: { message: 'lost sight' },
    } as never);
    return store;
  };

  // The history pool said Success and the persistent one Failed, for good: only a pending record was ever corrected
  it("corrects a local Failed with a server's Success", async () => {
    const store = await failedHere();
    const finished = vi.fn();
    store.getState().subscribeTxFinished(finished);
    await store
      .getState()
      .injectExternalPendingTxs([
        createTransaction({ txKey: '0xfail', status: TransactionStatus.Success, pending: false }),
      ]);
    expect(store.getState().transactionsPool['0xfail']).toMatchObject({
      status: TransactionStatus.Success,
      pending: false,
      isError: false,
    });
    expect(store.getState().transactionsPool['0xfail'].error).toBeUndefined();
    expect(finished).toHaveBeenCalledTimes(1);
  });

  it('keeps a local Failed against a server that proves nothing more', async () => {
    const store = await failedHere();
    await store
      .getState()
      .injectExternalPendingTxs([
        createTransaction({ txKey: '0xfail', status: TransactionStatus.Replaced, pending: false }),
      ]);
    expect(store.getState().transactionsPool['0xfail'].status).toBe(TransactionStatus.Failed);
  });

  it('clears the endpoints and keys older versions saved in localStorage', async () => {
    const storage = createMemoryStorage();
    storage.setItem(
      'old-records',
      JSON.stringify({
        state: {
          transactionsPool: {
            '0xa': { ...createTransaction({ txKey: '0xa' }), rpcUrl: 'https://rpc/key', gelatoApiKey: 'secret' },
          },
        },
        version: 0,
      }),
    );
    const store = createStore({ name: 'old-records', storage: createJSONStorage(() => storage) });
    expect(store.getState().transactionsPool['0xa']).toBeDefined();
    expect(store.getState().transactionsPool['0xa']).not.toHaveProperty('rpcUrl');
    expect(store.getState().transactionsPool['0xa']).not.toHaveProperty('gelatoApiKey');
  });

  // Every save writes the list of unsynced keys last-writer-wins, and a second tab erased it: the sync was never tried again
  it('finds what is still unsynced from the records themselves', async () => {
    const storage = createMemoryStorage();
    storage.setItem(
      'unsynced',
      JSON.stringify({
        state: { transactionsPool: { '0xa': createTransaction({ txKey: '0xa', syncStatus: 'pending-sync' }) } },
        version: 0,
      }),
    );
    const onRemoteCreate = vi.fn(async () => undefined);
    const store = createStore({ name: 'unsynced', storage: createJSONStorage(() => storage), onRemoteCreate });
    await store.getState().reconcileUnsyncedTransactions();
    expect(onRemoteCreate).toHaveBeenCalledTimes(1);
  });

  // A second transaction started while the wallet still asked about the first, and each wrote over the other's state
  it("a transaction that finishes late does not write over the next one's state", async () => {
    const store = createStore();
    let answerFirst: (key: string) => void = () => undefined;
    const first = store.getState().executeTxAction({
      actionFunction: () => new Promise<string>((resolve) => (answerFirst = resolve)),
      params: createValidParams(),
      defaultTracker: TransactionTracker.Ethereum,
    } as never);
    await new Promise((resolve) => setImmediate(resolve));
    const second = vi.fn(async () => '0x2222');
    await store.getState().executeTxAction({
      actionFunction: second,
      params: createValidParams(),
      defaultTracker: TransactionTracker.Ethereum,
    } as never);
    expect(store.getState().initialTx?.lastTxKey).toBe('0x2222');
    answerFirst('0x1111');
    await first;
    expect(store.getState().initialTx?.lastTxKey).toBe('0x2222');
    expect(store.getState().transactionsPool['0x1111']).toBeDefined();
  });

  // localStorage nearly full: the send worked, the save did not, and the page said the send had failed and offered Retry
  it('a save that fails never reads as a failed send', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const checkAndInitializeTrackerInStore = vi.fn();
    const full: StateStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => undefined,
    };
    const store = createStore({
      adapter: createAdapter({ checkAndInitializeTrackerInStore }),
      storage: createJSONStorage(() => full),
    });
    await store.getState().executeTxAction({
      actionFunction: async () => txHash,
      params: createValidParams(),
      defaultTracker: TransactionTracker.Ethereum,
    } as never);
    expect(store.getState().initialTx?.error).toBeUndefined();
    expect(store.getState().initialTx?.lastTxKey).toBe(txHash);
    expect(checkAndInitializeTrackerInStore).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});
