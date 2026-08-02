/**
 * @file This file defines the core Zustand slice for managing the state of transactions. It includes the state,
 * actions, and types necessary for initializing the store and performing CRUD operations on the transaction pool.
 */

import { produce } from 'immer';

import { IInitializeTxTrackingStore, PulsarAdapter, StoreSlice, Transaction, TransactionStatus } from '../types';
import { validateTransaction } from '../utils/transactionValidation';

/**
 * Creates a Zustand store slice with the core logic for transaction state management.
 * This function is a slice creator intended for use with Zustand's `create` function.
 *
 * @template T The specific transaction type.
 * @param options Configuration for the store slice.
 * @returns A Zustand store slice implementing `IInitializeTxTrackingStore`.
 */
export function initializeTxTrackingStore<T extends Transaction>({
  maxTransactions,
  onRemoteCreate,
}: Pick<PulsarAdapter<T>, 'onRemoteCreate'> & { maxTransactions: number }): StoreSlice<IInitializeTxTrackingStore<T>> {
  let isReconciling = false;

  return (set, get) => ({
    transactionsPool: {},
    lastAddedTxKey: undefined,
    initialTx: undefined,
    unsyncedTxKeys: {},

    reconcileUnsyncedTransactions: async () => {
      if (!onRemoteCreate || isReconciling) return;

      const unsyncedKeys = Object.keys(get().unsyncedTxKeys || {});
      if (unsyncedKeys.length === 0) return;

      isReconciling = true;

      try {
        for (const key of unsyncedKeys) {
          const tx = get().transactionsPool[key];
          if (!tx) {
            // If tx is no longer in pool, clear it from unsynced
            set((s) =>
              produce(s, (draft) => {
                if (draft.unsyncedTxKeys) delete draft.unsyncedTxKeys[key];
              }),
            );
            continue;
          }

          try {
            await onRemoteCreate(tx);
            set((s) =>
              produce(s, (draft) => {
                const draftTx = draft.transactionsPool[key];
                if (draftTx) {
                  draftTx.syncStatus = 'synced';
                }
                if (draft.unsyncedTxKeys) {
                  delete draft.unsyncedTxKeys[key];
                }
              }),
            );
          } catch (e) {
            console.warn(`[Pulsar] Failed to reconcile tx ${key}:`, e);
          }
        }
      } finally {
        isReconciling = false;
      }
    },

    addTxToPool: (tx) => {
      validateTransaction(tx);

      const newTx = {
        ...tx,
        pending: true, // Ensure all new transactions start as pending.
      };

      const runOnRemoteCreateAndCommit = async () => {
        let isSyncFailed = false;

        if (onRemoteCreate) {
          try {
            await onRemoteCreate(newTx);
            newTx.syncStatus = 'synced';
          } catch (error) {
            console.warn('[Pulsar] onRemoteCreate failed, transaction queued for background sync:', error);
            newTx.syncStatus = 'pending-sync';
            isSyncFailed = true;
          }
        }

        set((state) =>
          produce(state, (draft) => {
            draft.lastAddedTxKey = tx.txKey;

            if (isSyncFailed) {
              if (!draft.unsyncedTxKeys) {
                draft.unsyncedTxKeys = {};
              }
              draft.unsyncedTxKeys[tx.txKey] = true;
            }

            if (tx.txKey) {
              const currentCount = Object.keys(draft.transactionsPool).length;

              // FIFO Eviction Policy
              if (currentCount >= maxTransactions) {
                const sortedTxs = Object.values(draft.transactionsPool).sort((a, b) => {
                  return (a as T).localTimestamp - (b as T).localTimestamp;
                });

                if (sortedTxs.length > 0) {
                  const oldestTx = sortedTxs[0] as T;
                  delete draft.transactionsPool[oldestTx.txKey];
                }
              }

              draft.transactionsPool[tx.txKey] = newTx as (typeof draft.transactionsPool)[string];
            }
          }),
        );
      };

      return runOnRemoteCreateAndCommit();
    },

    updateTxParams: (txKey, fields) => {
      set((state) =>
        produce(state, (draft) => {
          const tx = draft.transactionsPool[txKey];
          // Ensure the transaction exists before attempting to update.
          if (tx) {
            Object.assign(tx, fields);
          }
        }),
      );

      // Trigger reconciliation if transitioning to a terminal state and it's unsynced
      const isTerminalStatus =
        fields.status === TransactionStatus.Success ||
        fields.status === TransactionStatus.Failed ||
        fields.status === TransactionStatus.Replaced;

      if (isTerminalStatus) {
        if (get().reconcileUnsyncedTransactions && get().unsyncedTxKeys?.[txKey]) {
          // Fire and forget asynchronous reconciliation
          get()
            .reconcileUnsyncedTransactions()
            .catch((err: unknown) => {
              console.error('[Pulsar] Terminal reconciliation failed:', err);
            });
        }
      }
    },

    removeTxFromPool: (txKey) => {
      set((state) =>
        produce(state, (draft) => {
          delete draft.transactionsPool[txKey];
        }),
      );
    },

    closeTxTrackedModal: (txKey) => {
      set((state) =>
        produce(state, (draft) => {
          if (txKey && draft.transactionsPool[txKey]) {
            const tx = draft.transactionsPool[txKey];
            draft.transactionsPool[txKey] = {
              ...tx,
              isTrackedModalOpen: false,
            } as (typeof draft.transactionsPool)[string];
          }
          // Always clear the initial transaction state when a modal is closed
          draft.initialTx = undefined;
        }),
      );
    },

    getLastTxKey: () => get().lastAddedTxKey,
  });
}
