/**
 * @file The Pulsar transaction store: the core slice, the orchestration of `executeTxAction` through chain adapters,
 * and persistence to `localStorage`.
 */

import { normalizeError, selectAdapterByKey, setChainId } from '@tuwaio/orbit-core';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { createJSONStorage, persist, PersistOptions, PersistStorage } from 'zustand/middleware';
import { createStore, StoreApi } from 'zustand/vanilla';

import {
  EvmTransaction,
  ITxTrackingStore,
  PulsarAdapter,
  TrackerCallbacks,
  Transaction,
  TransactionPool,
  TransactionStatus,
  TransactionTracker,
} from '../types';
import { keepsItsResult, mergeTabPools } from '../utils/mergeTabPools';
import { normalizeRemoteTx } from '../utils/normalizeRemoteTx';
import { DEFAULT_RETENTION_DAYS, expiredTransactionKeys } from '../utils/transactionRetention';
import { validateInitialTransactionParams, validateTransaction } from '../utils/transactionValidation';
import { createTxFinishedNotifier, isFinishedStatus } from '../utils/txFinished';
import { initializeTxTrackingStore } from './initializeTxTrackingStore';

/** A storage whose failed save is logged, not thrown: the state in memory goes on, and the next save tries again. */
function withoutFailingSaves<S>(storage: PersistStorage<S> | undefined): PersistStorage<S> | undefined {
  if (!storage) return storage;
  const logged = (error: unknown) => console.warn('[Pulsar] The transactions could not be saved:', error);
  return {
    ...storage,
    setItem: (name, value) => {
      try {
        const saved = storage.setItem(name, value);
        return saved instanceof Promise ? saved.catch(logged) : saved;
      } catch (error) {
        logged(error);
      }
    },
  };
}

/**
 * Creates the Pulsar transaction store: a vanilla Zustand store (use it from any framework, or bind it to React with
 * `createBoundedUseStore`) that runs transactions through chain adapters and tracks them in the background.
 *
 * Side effects: the state is saved with Zustand's `persist` middleware under the key `name`, by default in
 * `localStorage`, on every change: `transactionsPool`, `lastAddedTxKey` and `unsyncedTxKeys`. A finished transaction
 * is kept for `retentionDays` (30 by default) and at most `maxTransactions` are kept. `initialTx` is neither
 * saved nor restored (pass your own `partialize` and `merge` to change that). In the browser the saved state is
 * restored synchronously when the store is created. Where
 * `localStorage` is not available (server rendering), nothing is read or written and Zustand logs a warning on
 * updates. Creating the store starts no tracker: call `initializeTransactionsPool` on the client. Later, a storage event
 * starts trackers for the pending transactions of another tab, which means RPC requests from this tab too.
 * In the browser it listens to `storage` events and merges what another tab has saved, by transaction, into this tab's
 * pool, and it tracks the pending transactions it learns that way, so a closed tab leaves nothing unfinished. Every
 * transaction gets one tracker, however often `initializeTransactionsPool` runs. A speed-up made in the wallet or through
 * `speedUpTxAction` continues in a new record: the old one ends as `Replaced`, and a new one under the new hash, linked by
 * `replaces`, goes on to the result with the same callbacks.
 *
 * @template T - The application transaction type.
 * @param params - The adapters, the store options and the options of Zustand's `persist` middleware.
 * @param params.adapter - A chain adapter, or an array of adapters, such as `pulsarEvmAdapter` from
 * `@tuwaio/pulsar-evm` or `pulsarSolanaAdapter` from `@tuwaio/pulsar-solana`.
 * @param params.maxTransactions - Maximum number of transactions in the pool. Defaults to 50.
 * @param params.retentionDays - Days a finished transaction stays in the pool, from its `finishedTimestamp`: expired
 *   ones are dropped when the saved state is restored and when a transaction is added. `null` keeps them without a
 *   term. Defaults to 30.
 * @param params.onRemoteCreate - Remote sync callback (see `SyncCallbacks`).
 * @param params.beforeTxProcess - Global preflight callback (see `BeforeTxProcess`).
 * @param params.abortOnTxError - Whether a `beforeTxProcess` error aborts the transaction. Defaults to `true`.
 * @param params.onTxFinished - Called when a transaction finishes, also after a page reload, per open tab (see
 *   `TxFinishedListener`).
 * @param params.name - The storage key. Required by `persist`; use a different key for every store.
 * @returns The vanilla Zustand store. `store.persist` exposes the `persist` API (for example `clearStorage()`).
 *
 * @example
 * ```ts
 * import { createPulsarStore } from '@tuwaio/pulsar-core';
 * import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';
 *
 * export const pulsarStore = createPulsarStore({
 *   name: 'transactions-tracking-storage',
 *   adapter: pulsarEvmAdapter(wagmiConfig, appChains),
 * });
 * ```
 */
export function createPulsarStore<T extends Transaction>({
  adapter,
  maxTransactions = 50,
  retentionDays = DEFAULT_RETENTION_DAYS,
  onRemoteCreate,
  beforeTxProcess,
  abortOnTxError,
  onTxFinished,
  ...options
}: PulsarAdapter<T> & PersistOptions<ITxTrackingStore<T>>) {
  // Listeners of the "transaction finished" event live in memory: functions cannot be saved with the pool
  const txFinished = createTxFinishedNotifier<T>(onTxFinished);

  // One tracker per transaction: a second one on the same hash joins the viem watcher of the first and goes silent when
  // the first one's timer stops it. A key leaves with the final status or the removal of its transaction, as trackers of
  // a polling kind resolve as soon as they start, and the same key can come back (a Safe proposes the same hash again).
  const trackedTxKeys = new Set<string>();
  const startTracker = async (txKey: string, start: () => Promise<void> | void) => {
    if (trackedTxKeys.has(txKey)) return;
    trackedTxKeys.add(txKey);
    try {
      await start();
    } catch (error) {
      trackedTxKeys.delete(txKey);
      throw error;
    }
  };

  // What executeTxAction was given, in memory as functions cannot be saved. Trackers get `callbacksOf`, which looks here at
  // the moment of the call and runs each callback once for a record: a result can reach this tab through its own tracker
  // and through another tab or a server, and a speed-up hands the callbacks on after the tracker of the new hash started.
  const trackerCallbacks = new Map<string, { callbacks: TrackerCallbacks<T>; called: Set<string> }>();
  // Removed here, so the next save of another tab does not bring them back at once, with a new tracker
  const removedTxKeys = new Set<string>();

  const runCallback = (txKey: string, name: keyof TrackerCallbacks<T>, ...args: unknown[]) => {
    const entry = trackerCallbacks.get(txKey);
    if (!entry || entry.called.has(name)) return;
    entry.called.add(name);
    const log = (error: unknown) => console.error(`[Pulsar] ${name} callback threw for ${txKey}:`, error);
    try {
      void Promise.resolve((entry.callbacks[name] as ((...a: unknown[]) => unknown) | undefined)?.(...args)).catch(log);
    } catch (error) {
      log(error);
    }
    // An error after a reverted replacement is the last thing that can come
    const tx = args[0] as T | undefined;
    if (name !== 'onReplaced' || !tx?.isError) trackerCallbacks.delete(txKey);
  };
  const callbacksOf = (txKey: string): TrackerCallbacks<T> => ({
    onSuccess: (tx) => runCallback(txKey, 'onSuccess', tx),
    onError: (error, tx) => runCallback(txKey, 'onError', error, tx),
    onReplaced: (newTx, oldTx) => runCallback(txKey, 'onReplaced', newTx, oldTx),
  });

  const startRestored = (tx: T) =>
    startTracker(tx.txKey, () =>
      selectAdapterByKey({ adapterKey: tx.adapter, adapter })?.checkAndInitializeTrackerInStore({
        tx,
        ...callbacksOf(tx.txKey),
        ...store.getState(),
      }),
    ).catch((error: unknown) => {
      console.error(`[Pulsar] Could not track ${tx.txKey}:`, error);
    });

  /**
   * A speed-up is the same operation under a new hash: the old record ends as `Replaced`, and a new record goes on to the
   * result, linked by `replaces`, with the callbacks of the old one. Only for `repriced`: a cancel or another transaction in
   * the nonce is not this operation, and "Success" on a transfer of nothing to oneself would be false.
   */
  const followSpeedUp = (replaced: T) => {
    const { replacedTxHash, replacedReason } = replaced as unknown as EvmTransaction;
    if (replaced.status !== TransactionStatus.Replaced || replacedReason !== 'repriced' || !replacedTxHash) return;

    const entry = trackerCallbacks.get(replaced.txKey);
    if (entry) trackerCallbacks.set(replacedTxHash, { callbacks: entry.callbacks, called: new Set() });

    const before = store.getState();
    const known = before.transactionsPool[replacedTxHash] as EvmTransaction | undefined;

    // A reorganization brought the original back in place of its replacement: the two would be replaced by each other, and
    // no record would say the money moved. The original is pending again.
    if (known?.status === TransactionStatus.Replaced && known.replacedTxHash === replaced.txKey) {
      store.setState(
        produce(before, (draft) => {
          const reopened = draft.transactionsPool[replacedTxHash] as EvmTransaction | undefined;
          if (!reopened) return;
          reopened.pending = true;
          for (const field of [
            'status',
            'isError',
            'error',
            'finishedTimestamp',
            'replacedTxHash',
            'replacedReason',
          ] as const) {
            delete reopened[field];
          }
        }),
      );
      const tx = store.getState().transactionsPool[replacedTxHash];
      if (tx) void startRestored(tx);
      return;
    }

    // Another tab or a remote history has added it, maybe with its result. Its tracker reads the callbacks moved above; if it
    // has already finished, nothing would call them.
    if (known) {
      // What followed the old record on this screen follows the new one here too, or its modal would close by itself
      store.setState(
        produce(before, (draft) => {
          if (draft.lastAddedTxKey === replaced.txKey) draft.lastAddedTxKey = replacedTxHash;
          if (draft.initialTx?.lastTxKey === replaced.txKey) draft.initialTx.lastTxKey = replacedTxHash;
          const old = draft.transactionsPool[replaced.txKey];
          const next = draft.transactionsPool[replacedTxHash];
          if (old?.isTrackedModalOpen && next) {
            next.isTrackedModalOpen = true;
            old.isTrackedModalOpen = false;
          }
        }),
      );
      if (known.pending && !trackedTxKeys.has(replacedTxHash)) void startRestored(known as unknown as T);
      else if (!known.pending) deliverResult(known as unknown as T);
      return;
    }

    const next = {
      ...replaced,
      txKey: replacedTxHash,
      hash: replacedTxHash,
      tracker: TransactionTracker.Ethereum,
      replaces: replaced.txKey,
      // It is in a block: this is how a record says so, and why speed-up and cancel are not offered on it
      confirmations: 1,
    } as unknown as T & Partial<EvmTransaction>;
    for (const field of ['status', 'isError', 'error', 'finishedTimestamp', 'syncStatus'] as const) {
      delete next[field as keyof typeof next];
    }
    delete next.replacedTxHash;
    delete next.replacedReason;

    // A record that never went to the backend has no row there to continue, such as a payment handed over from a checkout
    try {
      void before.addTxToPool(next, { withoutSync: !replaced.syncStatus });
    } catch (error) {
      console.error('[Pulsar] Could not add the transaction that replaced another:', error);
      return;
    }
    store.setState(
      produce(store.getState(), (draft) => {
        // Whatever followed the old record follows the new one, unless a later transaction has taken over
        if (before.lastAddedTxKey !== replaced.txKey) draft.lastAddedTxKey = before.lastAddedTxKey;
        if (draft.initialTx?.lastTxKey === replaced.txKey) draft.initialTx.lastTxKey = replacedTxHash;
        const old = draft.transactionsPool[replaced.txKey];
        if (old) old.isTrackedModalOpen = false;
      }),
    );

    const tx = store.getState().transactionsPool[replacedTxHash];
    if (tx) void startRestored(tx);
  };

  /** Runs the callbacks of a result that came from another tab or a server, which no tracker of this tab will report. */
  const deliverResult = (tx: T) => {
    if (tx.status === TransactionStatus.Success) runCallback(tx.txKey, 'onSuccess', tx);
    else if (tx.status === TransactionStatus.Failed) {
      runCallback(tx.txKey, 'onError', new Error(tx.error?.message ?? 'The transaction failed.'), tx);
    } else if (tx.status === TransactionStatus.Replaced) runCallback(tx.txKey, 'onReplaced', tx, tx);
  };

  /** A final result that did not come through this tab's tracker, which stops at its next check. */
  const finishedElsewhere = (tx: T) => {
    trackedTxKeys.delete(tx.txKey);
    followSpeedUp(tx);
    deliverResult(tx);
    txFinished.notify(tx);
  };

  const store = createStore<ITxTrackingStore<T>>()(
    persist(
      (set, get) => ({
        // Initialize the base store slice with core state and actions
        ...initializeTxTrackingStore<T>({
          maxTransactions,
          retentionDays,
          onRemoteCreate,
          onTxFinished: (tx) => {
            trackedTxKeys.delete(tx.txKey);
            followSpeedUp(tx);
            txFinished.notify(tx);
          },
          onTxRemoved: (txKey) => {
            trackedTxKeys.delete(txKey);
            trackerCallbacks.delete(txKey);
            removedTxKeys.add(txKey);
          },
        })(set, get),

        getAdapter: () => adapter,

        subscribeTxFinished: txFinished.subscribe,

        isTxTracked: (txKey) => trackedTxKeys.has(txKey),

        // Restarts the trackers of pending transactions, e.g. after a page reload.
        initializeTransactionsPool: async () => {
          const pendingTxs = Object.values(get().transactionsPool).filter((tx) => tx.pending);
          const validPendingTxs = pendingTxs.filter((tx) => {
            try {
              validateTransaction(tx);
              return true;
            } catch (error) {
              console.warn('[Pulsar] Removed invalid persisted transaction:', error);
              get().removeTxFromPool(tx.txKey);
              return false;
            }
          });

          // Concurrently initialize trackers for all pending transactions
          await Promise.all(
            validPendingTxs.map((tx) => {
              const foundAdapter = selectAdapterByKey({
                adapterKey: tx.adapter,
                adapter,
              });
              // Delegate tracker initialization to the appropriate adapter
              return startTracker(tx.txKey, () =>
                foundAdapter?.checkAndInitializeTrackerInStore({
                  tx,
                  ...callbacksOf(tx.txKey),
                  ...get(),
                }),
              );
            }),
          );
        },

        injectExternalPendingTxs: async (remoteTxs: T[]) => {
          const state = get();
          const adapter = state.getAdapter();
          const txsToTrack: T[] = [];
          // Local transactions that the remote backend reports as finished, for the "transaction finished" event
          const finishedTxKeys: string[] = [];
          // Normalized first: a row brings its empty columns as `null` and its numbers as strings
          const validRemoteTxs = remoteTxs.map(normalizeRemoteTx).filter((remoteTx) => {
            try {
              validateTransaction(remoteTx);
              return true;
            } catch (error) {
              console.warn('[Pulsar] Skipped invalid remote transaction:', error);
              return false;
            }
          });

          // 1. Synchronously update the local state using Immer
          set((currentState) =>
            produce(currentState, (draft) => {
              const pool = draft.transactionsPool as TransactionPool<T>;

              validRemoteTxs.forEach((remoteTx) => {
                const localTx = pool[remoteTx.txKey];

                // Case A: Transaction is pending remotely but doesn't exist locally (Cross-device).
                // Not one a person stopped tracking here: the next page of a history must not bring it back, with a new tracker
                if (remoteTx.pending && !localTx && !removedTxKeys.has(remoteTx.txKey)) {
                  const record = normalizeRemoteTx(remoteTx);
                  pool[remoteTx.txKey] = record as Extract<T, Transaction>;
                  txsToTrack.push(record);
                }

                // Case B: Self-healing. Local is stuck on pending, or holds a `Failed` the chain answers otherwise, and remote
                // says it's terminal.
                const correctable =
                  localTx && !isFinishedStatus(localTx.status)
                    ? localTx.pending
                    : localTx?.status !== remoteTx.status && !keepsItsResult(localTx?.status, remoteTx.status);
                if (localTx && correctable && isFinishedStatus(remoteTx.status)) {
                  // A server's Failed can be its own time limit, and its Replaced may not say why, when a speed-up is what
                  // decides whether a new record follows. While this page's tracker runs, the chain answers
                  const remoteReason = (remoteTx as unknown as EvmTransaction).replacedReason;
                  const provesNothing =
                    remoteTx.status === TransactionStatus.Failed ||
                    (remoteTx.status === TransactionStatus.Replaced && !remoteReason);
                  if (provesNothing && (trackedTxKeys.has(remoteTx.txKey) || isFinishedStatus(localTx.status))) return;
                  finishedTxKeys.push(remoteTx.txKey);
                  if (remoteTx.status === TransactionStatus.Success) {
                    localTx.isError = false;
                    delete localTx.error;
                  }
                  localTx.status = remoteTx.status;
                  localTx.pending = false;
                  if (remoteTx.txKey) localTx.txKey = remoteTx.txKey;
                  if (remoteTx.finishedTimestamp) localTx.finishedTimestamp = remoteTx.finishedTimestamp;
                  if (remoteTx.isError !== undefined) localTx.isError = remoteTx.isError;
                  if (remoteTx.error) localTx.error = remoteTx.error;
                  const remote = remoteTx as unknown as EvmTransaction;
                  const local = localTx as unknown as EvmTransaction;
                  if (remote.hash) local.hash = remote.hash;
                  if (remote.replacedTxHash) local.replacedTxHash = remote.replacedTxHash;
                  if (remote.replacedReason) local.replacedReason = remote.replacedReason;
                }
              });
            }),
          );

          for (const txKey of finishedTxKeys) {
            const finishedTx = get().transactionsPool[txKey];
            if (finishedTx) finishedElsewhere(finishedTx);
          }

          // 2. Asynchronously start trackers for the newly injected pending transactions
          if (txsToTrack.length > 0) {
            await Promise.all(
              txsToTrack.map((tx) => {
                const foundAdapter = selectAdapterByKey({ adapterKey: tx.adapter, adapter });

                return startTracker(tx.txKey, () =>
                  foundAdapter?.checkAndInitializeTrackerInStore({
                    tx,
                    ...callbacksOf(tx.txKey),
                    // Pass the fresh state after the synchronous set above
                    ...get(),
                  }),
                );
              }),
            );
          }
        },

        // Runs a transaction from the chain check to the start of its tracker.
        executeTxAction: async ({
          defaultTracker,
          actionFunction,
          params,
          beforeTxProcess: localBeforeTxProcess,
          abortOnTxError: localAbortOnTxError,
          ...callbacks
        }) => {
          const shouldAbort = localAbortOnTxError ?? abortOnTxError ?? true;
          const localTimestamp = dayjs().unix();

          // Trigger background reconciliation on new tx action
          get()
            .reconcileUnsyncedTransactions()
            .catch((err) => console.error('[Pulsar] Reconciliation failed:', err));

          validateInitialTransactionParams(params);

          const { desiredChainID, tracker, ...restParams } = params;
          const { onSuccess, onError, onReplaced } = callbacks;

          // Step 1: Set initial state for immediate UI feedback (e.g., loading spinner).
          set({
            initialTx: {
              ...params,
              actionFunction,
              localTimestamp,
              isInitializing: true,
            },
          });

          const foundAdapter = selectAdapterByKey({
            adapterKey: restParams.adapter,
            adapter,
          });

          // Centralized error handler for this transaction flow
          const handleTxError = (e: unknown) => {
            set((state) =>
              produce(state, (draft) => {
                if (draft.initialTx) {
                  draft.initialTx.isInitializing = false;
                  draft.initialTx.error = normalizeError(e);
                }
              }),
            );
          };

          if (!foundAdapter) {
            const error = new Error('No adapter found for this transaction.');
            handleTxError(error);
            throw error; // Re-throw to allow the caller to handle it.
          }

          try {
            const { connectorType, walletAddress } = foundAdapter.getConnectorInfo();

            // Step 2: Ensure the wallet is connected to the correct chain.
            await foundAdapter.checkChainForTx(desiredChainID);

            try {
              await (localBeforeTxProcess ?? beforeTxProcess)?.();
            } catch (e) {
              if (shouldAbort) {
                set({
                  initialTx: {
                    ...params,
                    actionFunction,
                    localTimestamp,
                    isInitializing: false,
                    error: normalizeError(e),
                  },
                });
                throw e;
              }
              console.warn('[Pulsar] beforeTxProcess failed:', e);
            }

            // Step 3: Execute the provided action (e.g., signing and sending the transaction).
            const txKeyFromAction = await actionFunction();

            // If `txKeyFromAction` is undefined, it indicates the user cancelled the action.
            if (!txKeyFromAction) {
              set({ initialTx: undefined });
              return;
            }

            // Step 4: Determine the final tracker and txKey from the action's result.
            const { tracker: updatedTracker, txKey: finalTxKey } = foundAdapter.checkTransactionsTracker({
              actionTxKey: txKeyFromAction,
              connectorType,
              tracker,
              bundlerUrl: params.bundlerUrl,
              pimlicoApiKey: params.pimlicoApiKey,
            });

            // Step 5: Construct the full transaction object for the pool.
            const newTx = {
              ...restParams,
              connectorType,
              from: walletAddress,
              tracker: updatedTracker || defaultTracker,
              chainId: setChainId(desiredChainID),
              localTimestamp,
              txKey: finalTxKey,
              bundlerUrl: params.bundlerUrl,
              pimlicoApiKey: params.pimlicoApiKey,
              // For EVM, the hash is often the preliminary key from the action.
              hash: updatedTracker === 'ethereum' ? (txKeyFromAction as `0x${string}`) : undefined,
              pending: false, // will be set to true by addTxToPool
              isTrackedModalOpen: params.withTrackedModal,
            };

            // Step 6: Add the transaction to the pool.
            await get().addTxToPool(newTx as T);

            // Step 7: Update the initial state to link it with the newly created transaction.
            set((state) =>
              produce(state, (draft) => {
                if (draft.initialTx) {
                  draft.initialTx.isInitializing = false;
                  draft.initialTx.lastTxKey = finalTxKey;
                }
              }),
            );

            // Step 8: Initialize the background tracker for the transaction.
            const tx = get().transactionsPool[finalTxKey];
            removedTxKeys.delete(finalTxKey);
            trackerCallbacks.set(finalTxKey, { callbacks: { onSuccess, onError, onReplaced }, called: new Set() });
            await startTracker(finalTxKey, () =>
              foundAdapter.checkAndInitializeTrackerInStore({
                tx,
                ...callbacksOf(finalTxKey),
                ...get(),
              }),
            );
          } catch (e) {
            handleTxError(e);
            throw e; // Re-throw for external handling if needed.
          }
        },
      }),
      {
        // `initialTx` describes the flow running in this page (its `actionFunction` cannot be saved), so it is
        // neither saved nor restored: after a reload there is no half-finished signing state.
        partialize: (state) => {
          const persistedState = { ...state };
          delete persistedState.initialTx;
          return persistedState;
        },
        ...options, // Merges user-provided persistence options.
        // A save may fail (`localStorage` full): the money has gone by then, and a throw here read as a failed send, with Retry
        storage: withoutFailingSaves(options.storage ?? createJSONStorage<ITxTrackingStore<T>>(() => localStorage)),
        // The saved state comes back without the finished transactions past their term, whatever `merge` the app passes
        merge: (persistedState, currentState) => {
          const merged = options.merge
            ? options.merge(persistedState, currentState)
            : {
                ...currentState,
                ...(persistedState as Partial<ITxTrackingStore<T>>),
                initialTx: currentState.initialTx,
              };
          const expired = expiredTransactionKeys(merged.transactionsPool ?? {}, retentionDays);
          const transactionsPool = { ...merged.transactionsPool };
          // What older versions saved with a record and nothing reads any more: an endpoint or a key left in `localStorage` for good
          for (const [key, tx] of Object.entries(transactionsPool)) {
            if ('rpcUrl' in tx || 'gelatoApiKey' in tx) {
              const kept = { ...tx } as T & { rpcUrl?: string; gelatoApiKey?: string };
              delete kept.rpcUrl;
              delete kept.gelatoApiKey;
              transactionsPool[key] = kept as unknown as (typeof transactionsPool)[string];
            }
          }
          const unsyncedTxKeys = merged.unsyncedTxKeys ? { ...merged.unsyncedTxKeys } : merged.unsyncedTxKeys;
          for (const key of expired) {
            delete transactionsPool[key];
            if (unsyncedTxKeys) delete unsyncedTxKeys[key];
          }
          return { ...merged, transactionsPool, unsyncedTxKeys };
        },
      },
    ),
  );

  // Every change saves the whole pool, so a tab with an old copy would overwrite what another tab has written. Merged by
  // transaction, not rehydrated: see `mergeTabPools`. A function, as a `window` stubbed or in another runtime may lack it.
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function' && options.name) {
    const readOtherTab = async () => {
      const saved = await store.persist.getOptions().storage?.getItem(options.name);
      const theirs = (saved?.state as Partial<ITxTrackingStore<T>> | undefined)?.transactionsPool;
      if (!theirs) return;
      const valid = Object.fromEntries(
        Object.entries(theirs).filter(([key, tx]) => {
          if (removedTxKeys.has(key)) return false;
          try {
            validateTransaction(tx);
            return true;
          } catch {
            return false;
          }
        }),
      ) as TransactionPool<T>;
      const state = store.getState();
      const { pool, finished, added } = mergeTabPools(state.transactionsPool as TransactionPool<T>, valid, (txKey) =>
        trackedTxKeys.has(txKey),
      );
      if (pool !== state.transactionsPool)
        (store as StoreApi<ITxTrackingStore<T>>).setState({ transactionsPool: pool });
      // Finished first: a speed-up hands its callbacks on, and the new record among `added` must start with them
      for (const txKey of finished) finishedElsewhere(pool[txKey]);
      // The tab that sent it may close: this one must then be able to finish it
      for (const tx of added) void startRestored(tx);
    };
    window.addEventListener('storage', (event) => {
      if (event.key !== options.name) return;
      readOtherTab().catch((error: unknown) => console.error('[Pulsar] Could not read another tab:', error));
    });
  }

  return store;
}
