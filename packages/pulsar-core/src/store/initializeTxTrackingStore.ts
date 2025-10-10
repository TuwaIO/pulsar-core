/**
 * @file This file defines the core Zustand slice for managing the state of transactions. It includes the state,
 * actions, and types necessary for initializing the store and performing CRUD operations on the transaction pool.
 */

import { StoreSlice } from '@tuwaio/orbit-core/zustand';
import { Draft, produce } from 'immer';

import { IInitializeTxTrackingStore, Transaction } from '../types';

/**
 * Creates a Zustand store slice with the core logic for transaction state management.
 * This function is a slice creator intended for use with Zustand's `create` function.
 *
 * @template T The specific transaction type.
 * @param options Configuration for the store slice.
 * @returns A Zustand store slice implementing `IInitializeTxTrackingStore`.
 */
export function initializeTxTrackingStore<T extends Transaction>(): StoreSlice<IInitializeTxTrackingStore<T>> {
  return (set, get) => ({
    transactionsPool: {},
    lastAddedTxKey: undefined,
    initialTx: undefined,

    addTxToPool: (tx) => {
      set((state) =>
        produce(state, (draft) => {
          draft.lastAddedTxKey = tx.txKey;
          if (tx.txKey) {
            draft.transactionsPool[tx.txKey] = {
              ...tx,
              pending: true, // Ensure all new transactions start as pending.
            } as Draft<T>;
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
            draft.transactionsPool[txKey].isTrackedModalOpen = false;
          }
          // Always clear the initial transaction state when a modal is closed
          draft.initialTx = undefined;
        }),
      );
    },

    getLastTxKey: () => get().lastAddedTxKey,
  });
}
