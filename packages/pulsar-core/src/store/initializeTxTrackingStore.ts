/**
 * @file This file defines the core Zustand slice for managing the state of transactions. It includes the state,
 * actions, and types necessary for initializing the store and performing CRUD operations on the transaction pool.
 */

import { produce } from 'immer';

import { IInitializeTxTrackingStore, StoreSlice, Transaction } from '../types';

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
}: {
  maxTransactions: number;
}): StoreSlice<IInitializeTxTrackingStore<T>> {
  return (set, get) => ({
    transactionsPool: {},
    lastAddedTxKey: undefined,
    initialTx: undefined,

    addTxToPool: (tx) => {
      set((state) =>
        produce(state, (draft) => {
          draft.lastAddedTxKey = tx.txKey;
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

            const newTx = {
              ...tx,
              pending: true, // Ensure all new transactions start as pending.
            };
            draft.transactionsPool[tx.txKey] = newTx as (typeof draft.transactionsPool)[string];
          }
        }),
      );
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
