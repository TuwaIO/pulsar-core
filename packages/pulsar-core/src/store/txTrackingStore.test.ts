import { OrbitAdapter } from '@tuwaio/orbit-core';
import { describe, expect, it, vi } from 'vitest';
import { createJSONStorage, StateStorage } from 'zustand/middleware';

import { EvmTransaction, InitialTransactionParams, ITxTrackingStore, TransactionTracker, TxAdapter } from '../types';
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

  it('always blocks and throws when onRemoteCreate throws, regardless of abortOnTxError', async () => {
    const actionFunction = vi.fn().mockResolvedValue(txHash);
    const onRemoteCreate = vi.fn().mockRejectedValue(new Error('remote-sync-failed'));
    const store = createStore({
      onRemoteCreate,
      abortOnTxError: false,
    });

    await expect(
      store.getState().executeTxAction({
        actionFunction,
        params: createValidParams(),
      }),
    ).rejects.toThrow('remote-sync-failed');

    expect(actionFunction).toHaveBeenCalledTimes(1);
    expect(store.getState().transactionsPool[txHash]).toBeUndefined();
    expect(store.getState().initialTx?.error?.message).toBe('remote-sync-failed');
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
