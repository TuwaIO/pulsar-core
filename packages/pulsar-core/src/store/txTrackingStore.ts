/**
 * @file This file is the heart of the Pulsar store, orchestrating transaction handling,
 * state management, and communication with various blockchain adapters. It leverages
 * Zustand for state management, Immer for immutable updates, and a persistent middleware
 * to maintain state across sessions.
 */

import dayjs from 'dayjs';
import { produce } from 'immer';
import { persist, PersistOptions } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { ITxTrackingStore, Transaction, TxAdapter } from '../types';
import { selectAdapterByKey } from '../utils/selectAdapterByKey';
import { initializeTxTrackingStore } from './initializeTxTrackingStore';

/**
 * Creates the main Pulsar store for transaction tracking.
 *
 * This function sets up a Zustand store with persistence, combining the core
 * transaction slice with adapter-specific logic to handle the entire lifecycle
 * of a transaction.
 *
 * @template TR - The type of the tracker identifier (e.g., a string enum).
 * @template T - The specific transaction type, extending the base `Transaction`.
 * @template A - The type for the adapter-specific context or API.
 *
 * @param {object} config - Configuration object for creating the store.
 * @param {function} [config.onSucceedCallbacks] - Optional async callback executed on transaction success.
 * @param {TxAdapter<TR, T, A>[]} config.adapters - An array of adapters for different transaction types or chains.
 * @param {PersistOptions<ITxTrackingStore<TR, T, A>>} [options] - Configuration for the Zustand persist middleware.
 * @returns A fully configured Zustand store instance.
 */
export function createPulsarStore<TR, T extends Transaction<TR>, A>({
  onSucceedCallbacks,
  adapters,
  ...options
}: {
  onSucceedCallbacks?: (tx: T) => Promise<void> | void;
  adapters: TxAdapter<TR, T, A>[];
} & PersistOptions<ITxTrackingStore<TR, T, A>>) {
  return createStore<ITxTrackingStore<TR, T, A>>()(
    persist(
      (set, get) => ({
        ...initializeTxTrackingStore<TR, T, A>({ onSucceedCallbacks })(set, get),

        /**
         * Initializes trackers for all pending transactions upon store creation.
         * This is crucial for resuming tracking after a page refresh or session restoration.
         */
        initializeTransactionsPool: async () => {
          const pendingTxs = Object.values(get().transactionsPool).filter((tx) => tx.pending);

          await Promise.all(
            pendingTxs.map((tx) => {
              const adapter = selectAdapterByKey({
                adapterKey: tx.adapter,
                adapters,
              });
              return adapter?.checkAndInitializeTrackerInStore({ tx, ...get() });
            }),
          );
        },

        /**
         * The core function to orchestrate sending and tracking a new transaction.
         * It manages the entire lifecycle, including chain switching, wallet interactions,
         * state updates, and tracker initialization.
         */
        handleTransaction: async ({ defaultTracker, actionFunction, params }) => {
          const { desiredChainID, ...restParams } = params;
          const localTimestamp = dayjs().unix();

          // 1. Set initial state for immediate UI feedback
          set({
            initialTx: {
              ...params,
              actionFunction,
              localTimestamp,
              isInitializing: true,
            },
          });

          const adapter = selectAdapterByKey({
            adapterKey: restParams.adapter,
            adapters,
          });

          if (!adapter) {
            const error = new Error('No adapter found for this transaction.');
            handleTxError(error);
            throw error; // Re-throw to allow the caller to handle it
          }

          try {
            const { walletType, walletAddress } = adapter.getWalletInfo();

            // 2. Ensure the wallet is connected to the correct chain
            await adapter.checkChainForTx(desiredChainID);

            // 3. Execute the provided action function (e.g., signing a transaction)
            const txKeyFromAction = await actionFunction();

            if (!txKeyFromAction) {
              // If the user cancelled the action, clear the initial state.
              set({ initialTx: undefined });
              return;
            }

            // 4. Prepare the initial transaction object
            const txInitialParams = {
              ...restParams,
              walletType,
              from: walletAddress,
              tracker: defaultTracker,
              chainId: desiredChainID,
              localTimestamp,
              txKey: '', // Will be populated shortly
              pending: false,
              isTrackedModalOpen: params.withTrackedModal,
            };

            // 5. Determine the correct tracker and final txKey based on the action result
            const { tracker: updatedTracker, txKey: finalTxKey } = adapter.checkTransactionsTracker(
              txKeyFromAction,
              txInitialParams.walletType,
            );

            const newTx = {
              ...txInitialParams,
              tracker: updatedTracker,
              txKey: finalTxKey,
              hash: (updatedTracker === 'ethereum' ? txKeyFromAction : undefined) as `0x${string}`,
            };

            // 6. Add the finalized transaction to the pool
            get().addTxToPool(newTx);

            // 7. Update the initial state to reflect completion
            set((state) =>
              produce(state, (draft) => {
                if (draft.initialTx) {
                  draft.initialTx.isInitializing = false;
                  draft.initialTx.lastTxKey = finalTxKey;
                }
              }),
            );

            // 8. Initialize the background tracker for the new transaction
            const tx = get().transactionsPool[finalTxKey];
            await adapter.checkAndInitializeTrackerInStore({ tx, ...get() });
          } catch (e) {
            handleTxError(e);
            throw e; // Re-throw for external handling
          }

          /**
           * A centralized error handler for the transaction process.
           * @param {unknown} e - The error object.
           */
          function handleTxError(e: unknown) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            set((state) =>
              produce(state, (draft) => {
                if (draft.initialTx) {
                  draft.initialTx.isInitializing = false;
                  draft.initialTx.errorMessage = errorMessage;
                }
              }),
            );
          }
        },
      }),
      {
        ...options, // Zustand persist middleware options
      },
    ),
  );
}
