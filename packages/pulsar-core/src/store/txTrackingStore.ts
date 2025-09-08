import dayjs from 'dayjs';
import { Draft, produce } from 'immer';
import { persist, PersistOptions } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { ITxTrackingStore, Transaction, TxAdapter } from '../types';
import { selectAdapterByKey } from '../utils/selectAdapterByKey';
import { initializeTxTrackingStore } from './initializeTxTrackingStore';

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
        ...initializeTxTrackingStore<TR, T>({ onSucceedCallbacks })(set, get),

        /**
         * Initializes trackers for all pending transactions in the pool.
         * This is essential for resuming tracking after a page reload.
         */
        initializeTransactionsPool: async () => {
          await Promise.all(
            Object.values(get().transactionsPool).map(async (tx) => {
              if (tx.pending) {
                const adapter = selectAdapterByKey({ adapterKey: tx.adapter, adapters });
                adapter?.checkAndInitializeTrackerInStore({ tx, ...get() });
              }
            }),
          );
        },

        /**
         * The main function to orchestrate sending and tracking a new transaction.
         * It handles chain switching, wallet interactions, state updates, and tracker initialization.
         */
        handleTransaction: async ({ defaultTracker, actionFunction, params }) => {
          set({ initialTx: undefined }); // Clear any previous initial state
          const { desiredChainID, ...restParams } = params;
          const localTimestamp = dayjs().unix();

          const adapter = selectAdapterByKey({ adapterKey: restParams.adapter, adapters });

          const { walletType, walletAddress } = adapter ? adapter.getWalletInfo() : {};

          const txInitialParams = {
            ...restParams,
            walletType,
            from: walletAddress,
            tracker: defaultTracker,
            chainId: desiredChainID,
            localTimestamp,
            txKey: '', // Will be populated after the action
            pending: false,
            isTrackedModalOpen: params.withTrackedModal,
          } as Draft<T>;

          const handleError = (e: unknown) => {
            const errorMessage = e instanceof Error ? e.message : String(e);
            set((state) =>
              produce(state, (draft) => {
                if (draft.initialTx) {
                  draft.initialTx.isInitializing = false;
                  draft.initialTx.errorMessage = errorMessage;
                }
              }),
            );
            // Re-throw to allow the caller to handle the error as well
            throw new Error(`Transaction failed to initialize: ${errorMessage}`);
          };

          // Set initial state for immediate UI feedback
          set({
            initialTx: {
              ...params,
              localTimestamp,
              isInitializing: true,
            },
          });

          if (adapter) {
            try {
              // 1. Ensure the wallet is on the correct chain
              await adapter.checkChainForTx(desiredChainID);

              // 2. Execute the action (e.g., wallet call) to get a transaction key (hash, taskId, etc.)
              const txKeyFromAction = await actionFunction();

              if (txKeyFromAction) {
                // 3. Determine the correct tracker and final txKey
                const { tracker: updatedTracker, txKey: finalTxKey } = adapter.checkTransactionsTracker(
                  txKeyFromAction,
                  txInitialParams.walletType,
                );

                // 4. Add the transaction to the pool
                get().addTxToPool({
                  tx: {
                    ...txInitialParams,
                    tracker: updatedTracker,
                    txKey: finalTxKey,
                    hash: updatedTracker === 'ethereum' ? txKeyFromAction : undefined,
                  } as T,
                });

                // Update initial state to reflect that initialization is complete
                set((state) =>
                  produce(state, (draft) => {
                    if (draft.initialTx) {
                      draft.initialTx.isInitializing = false;
                      draft.initialTx.lastTxKey = finalTxKey;
                    }
                  }),
                );

                // 5. Start the background tracking process for the new transaction
                const tx = get().transactionsPool[finalTxKey];
                await adapter.checkAndInitializeTrackerInStore({ tx, ...get() });
              } else {
                // Action was likely cancelled by the user, clear the initial state
                set({ initialTx: undefined });
              }
            } catch (e) {
              handleError(e);
            }
          } else {
            handleError('No adapter found for this transaction.');
          }
        },
      }),
      {
        ...options, // Zustand persist middleware options
      },
    ),
  );
}
