/**
 * @file The Pulsar transaction store: the core slice, the orchestration of `executeTxAction` through chain adapters,
 * and persistence to `localStorage`.
 */

import { normalizeError, selectAdapterByKey, setChainId } from '@tuwaio/orbit-core';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { persist, PersistOptions } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { ITxTrackingStore, PulsarAdapter, Transaction, TransactionPool, TransactionStatus } from '../types';
import { validateInitialTransactionParams, validateTransaction } from '../utils/transactionValidation';
import { initializeTxTrackingStore } from './initializeTxTrackingStore';

/**
 * Creates the Pulsar transaction store: a vanilla Zustand store (use it from any framework, or bind it to React with
 * `createBoundedUseStore`) that runs transactions through chain adapters and tracks them in the background.
 *
 * Side effects: the state is saved with Zustand's `persist` middleware under the key `name`, by default in
 * `localStorage`, on every change: `transactionsPool`, `lastAddedTxKey` and `unsyncedTxKeys`. `initialTx` is neither
 * saved nor restored (pass your own `partialize` and `merge` to change that). In the browser the saved state is
 * restored synchronously when the store is created. Where
 * `localStorage` is not available (server rendering), nothing is read or written and Zustand logs a warning on
 * updates. Creating the store does not start any tracker: call `initializeTransactionsPool` once on the client.
 *
 * @template T - The application transaction type.
 * @param params - The adapters, the store options and the options of Zustand's `persist` middleware.
 * @param params.adapter - A chain adapter, or an array of adapters, such as `pulsarEvmAdapter` from
 * `@tuwaio/pulsar-evm` or `pulsarSolanaAdapter` from `@tuwaio/pulsar-solana`.
 * @param params.maxTransactions - Maximum number of transactions in the pool. Defaults to 50.
 * @param params.onRemoteCreate - Remote sync callback (see `SyncCallbacks`).
 * @param params.gelatoApiKey - Deprecated Gelato API key, passed to the trackers.
 * @param params.beforeTxProcess - Global preflight callback (see `BeforeTxProcess`).
 * @param params.abortOnTxError - Whether a `beforeTxProcess` error aborts the transaction. Defaults to `true`.
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
  onRemoteCreate,
  gelatoApiKey,
  beforeTxProcess,
  abortOnTxError,
  ...options
}: PulsarAdapter<T> & PersistOptions<ITxTrackingStore<T>>) {
  return createStore<ITxTrackingStore<T>>()(
    persist(
      (set, get) => ({
        // Initialize the base store slice with core state and actions
        ...initializeTxTrackingStore<T>({ maxTransactions, onRemoteCreate })(set, get),

        getAdapter: () => adapter,

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
              return foundAdapter?.checkAndInitializeTrackerInStore({
                tx,
                gelatoApiKey,
                ...get(),
              });
            }),
          );
        },

        injectExternalPendingTxs: async (remoteTxs: T[]) => {
          const state = get();
          const adapter = state.getAdapter();
          const txsToTrack: T[] = [];
          const validRemoteTxs = remoteTxs.filter((remoteTx) => {
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
                if (remoteTx.pending && !localTx) {
                  pool[remoteTx.txKey] = remoteTx as Extract<T, Transaction>;
                  txsToTrack.push(remoteTx);
                }

                // Case B: Self-healing. Local is stuck on pending, but remote says it's terminal.
                // Note: Ensure `isTerminalStatus` helper is accessible here or re-implemented.
                const isRemoteTerminal =
                  remoteTx.status === TransactionStatus.Success ||
                  remoteTx.status === TransactionStatus.Failed ||
                  remoteTx.status === TransactionStatus.Replaced;

                if (localTx?.pending && isRemoteTerminal) {
                  localTx.status = remoteTx.status;
                  localTx.pending = false;
                  if (remoteTx.txKey) localTx.txKey = remoteTx.txKey;
                  if (remoteTx.finishedTimestamp) localTx.finishedTimestamp = remoteTx.finishedTimestamp;
                }
              });
            }),
          );

          // 2. Asynchronously start trackers for the newly injected pending transactions
          if (txsToTrack.length > 0) {
            await Promise.all(
              txsToTrack.map((tx) => {
                const foundAdapter = selectAdapterByKey({ adapterKey: tx.adapter, adapter });

                return foundAdapter?.checkAndInitializeTrackerInStore({
                  tx,
                  gelatoApiKey,
                  // Pass the fresh state after the synchronous set above
                  ...get(),
                });
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
              gelatoApiKey: params.gelatoApiKey ?? gelatoApiKey,
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
            await foundAdapter.checkAndInitializeTrackerInStore({
              tx,
              onSuccess,
              onError,
              onReplaced,
              gelatoApiKey,
              ...get(),
            });
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
        merge: (persistedState, currentState) => ({
          ...currentState,
          ...(persistedState as Partial<ITxTrackingStore<T>>),
          initialTx: currentState.initialTx,
        }),
        ...options, // Merges user-provided persistence options.
      },
    ),
  );
}
