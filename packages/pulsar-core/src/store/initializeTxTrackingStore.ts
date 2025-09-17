/**
 * @file This file defines the core Zustand slice for managing the state of transactions. It includes the state,
 * actions, and types necessary for initializing the store and performing CRUD operations on the transaction pool.
 */

import { Draft, produce } from 'immer';

import { EvmTransaction, InitialTransaction, SolanaTransaction, StoreSlice, Transaction } from '../types';

/**
 * Defines the structure of the transaction pool, a key-value store of transactions indexed by their unique keys.
 * @template T The type of the transaction object being tracked.
 */
export type TransactionPool<T extends Transaction> = Record<string, T>;

/**
 * A utility type that creates a union of all fields that can be safely updated
 * on a transaction object via the `updateTxParams` action. This ensures type safety
 * and prevents accidental modification of immutable properties.
 */
type UpdatableTransactionFields = Partial<
  Pick<
    EvmTransaction,
    | 'to'
    | 'nonce'
    | 'txKey'
    | 'pending'
    | 'hash'
    | 'status'
    | 'replacedTxHash'
    | 'errorMessage'
    | 'finishedTimestamp'
    | 'isTrackedModalOpen'
    | 'isError'
    | 'maxPriorityFeePerGas'
    | 'maxFeePerGas'
    | 'input'
    | 'value'
  >
> &
  Partial<Pick<SolanaTransaction, 'slot' | 'confirmations' | 'fee' | 'instructions' | 'recentBlockhash' | 'rpcUrl'>>;

/**
 * The interface for the base transaction tracking store slice.
 * It includes the state and actions for managing the transaction lifecycle.
 * @template T The specific transaction type.
 */
export interface IInitializeTxTrackingStore<T extends Transaction> {
  /** A callback function executed when any transaction successfully completes. */
  onSucceedCallbacks?: (tx: T) => Promise<void> | void;
  /** A pool of all transactions currently being tracked, indexed by `txKey`. */
  transactionsPool: TransactionPool<T>;
  /** The `txKey` of the most recently added transaction. */
  lastAddedTxKey?: string;
  /** The state for a transaction being initiated, used for UI feedback before it's submitted to the chain. */
  initialTx?: InitialTransaction;

  /** Adds a new transaction to the tracking pool and marks it as pending. */
  addTxToPool: (tx: T) => void;
  /** Updates one or more properties of an existing transaction in the pool. */
  updateTxParams: (txKey: string, fields: UpdatableTransactionFields) => void;
  /** Removes a transaction from the tracking pool by its key. */
  removeTxFromPool: (txKey: string) => void;
  /** Closes the tracking modal for a transaction and clears any initial transaction state. */
  closeTxTrackedModal: (txKey?: string) => void;
  /** A selector function to retrieve the key of the last transaction added to the pool. */
  getLastTxKey: () => string | undefined;
}

/**
 * Creates a Zustand store slice with the core logic for transaction state management.
 * This function is a slice creator intended for use with Zustand's `create` function.
 *
 * @template T The specific transaction type.
 * @param options Configuration for the store slice.
 * @param options.onSucceedCallbacks An optional async callback to run when a transaction succeeds.
 * @returns A Zustand store slice implementing `IInitializeTxTrackingStore`.
 */
export function initializeTxTrackingStore<T extends Transaction>({
  onSucceedCallbacks,
}: {
  onSucceedCallbacks?: (tx: T) => Promise<void> | void;
}): StoreSlice<IInitializeTxTrackingStore<T>> {
  return (set, get) => ({
    onSucceedCallbacks,

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
