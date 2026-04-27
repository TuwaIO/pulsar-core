/**
 * @file This file is the nucleus of the Pulsar store, orchestrating transaction handling, state management,
 * and communication with blockchain adapters. It utilizes Zustand for state management, Immer for safe,
 * immutable updates, and a persistence middleware to maintain state across user sessions.
 */

import { normalizeError, selectAdapterByKey, setChainId } from '@tuwaio/orbit-core';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { persist, PersistOptions } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { ITxTrackingStore, PulsarAdapter, Transaction, TransactionPool, TransactionStatus } from '../types';
import { initializeTxTrackingStore } from './initializeTxTrackingStore';

/**
 * Creates the main Pulsar store for transaction tracking.
 *
 * This function configures a Zustand store enhanced with persistence. It combines the core transaction management
 * slice with a powerful orchestration logic that leverages chain-specific adapters to handle the entire
 * lifecycle of a transaction—from initiation and chain validation to execution and background status tracking.
 *
 * @template T The specific transaction type, extending the base `Transaction`.
 *
 * @param config Configuration object for creating the store.
 * @param config.adapter Adapter or an array of adapters for different chains or transaction types.
 * @param options Configuration for the Zustand `persist` middleware.
 * @returns A fully configured Zustand store instance.
 */
export function createPulsarStore<T extends Transaction>({
  adapter,
  maxTransactions = 50,
  onRemoteCreate,
  gelatoApiKey,
  ...options
}: PulsarAdapter<T> & PersistOptions<ITxTrackingStore<T>>) {
  return createStore<ITxTrackingStore<T>>()(
    persist(
      (set, get) => ({
        // Initialize the base store slice with core state and actions
        ...initializeTxTrackingStore<T>({ maxTransactions, onRemoteCreate })(set, get),

        getAdapter: () => adapter,

        /**
         * Initializes trackers for all pending transactions upon store creation.
         * This is crucial for resuming tracking after a page refresh or session restoration.
         */
        initializeTransactionsPool: async () => {
          const pendingTxs = Object.values(get().transactionsPool).filter((tx) => tx.pending);

          // Concurrently initialize trackers for all pending transactions
          await Promise.all(
            pendingTxs.map((tx) => {
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

          // 1. Synchronously update the local state using Immer
          set((currentState) =>
            produce(currentState, (draft) => {
              const pool = draft.transactionsPool as TransactionPool<T>;

              remoteTxs.forEach((remoteTx) => {
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

        /**
         * The primary function to orchestrate sending and tracking a new transaction.
         * It manages the entire lifecycle, from UI state updates and chain switching to
         * signing, submission, and background tracker initialization.
         */
        executeTxAction: async ({ defaultTracker, actionFunction, params, ...callbacks }) => {
          const { desiredChainID, tracker, ...restParams } = params;
          const { onSuccess, onError, onReplaced } = callbacks;
          const localTimestamp = dayjs().unix();

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
              gelatoApiKey,
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
              // For EVM, the hash is often the preliminary key from the action.
              hash: updatedTracker === 'ethereum' ? (txKeyFromAction as `0x${string}`) : undefined,
              pending: false, // will be set to true by addTxToPool
              isTrackedModalOpen: params.withTrackedModal,
            };

            // Step 6: Add the transaction to the pool.
            get().addTxToPool(newTx as T);

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
        ...options, // Merges user-provided persistence options.
      },
    ),
  );
}
