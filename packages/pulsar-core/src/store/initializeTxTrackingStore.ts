/**
 * @file This file provides the core slice for the Zustand store, responsible for managing the state of transactions.
 * It includes functions and types for initializing the store and performing basic CRUD operations on the transaction pool.
 */

import { Draft, produce } from 'immer';

import { EvmTransaction, InitialTransaction, SolanaTransaction, StoreSlice, Transaction } from '../types';

/**
 * Defines the structure of the transaction pool, which is a record of transactions indexed by their unique keys.
 * @template TR - The type of the tracker identifier.
 * @template T - The transaction type.
 */
export type TransactionPool<TR, T extends Transaction<TR>> = Record<string, T>;

/**
 * A utility type that extracts a subset of fields from the `Transaction` type
 * that are updatable via the `updateTxParams` action.
 * @template TR - The type of the tracker identifier.
 */
type UpdatableTransactionFields<TR> = Partial<
  Pick<
    EvmTransaction<TR>,
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
  Partial<
    Pick<SolanaTransaction<TR>, 'slot' | 'confirmations' | 'fee' | 'instructions' | 'recentBlockhash' | 'rpcUrl'>
  >;

/**
 * Defines the interface for the base transaction tracking store slice.
 * It includes the state and actions for managing transactions.
 * @template TR - The type of the tracker identifier.
 * @template T - The transaction type.
 */
export interface IInitializeTxTrackingStore<TR, T extends Transaction<TR>, A> {
  /** An optional callback function to be executed when a transaction successfully completes. */
  onSucceedCallbacks?: (tx: T) => Promise<void> | void;
  /** A pool of all transactions currently being tracked, indexed by their `txKey`. */
  transactionsPool: TransactionPool<TR, T>;
  /** The key of the most recently added transaction. */
  lastAddedTxKey?: string;
  /** The state of a transaction that is currently being initiated but not yet submitted. */
  initialTx?: InitialTransaction<A>;

  /** Adds a new transaction to the tracking pool. */
  addTxToPool: (tx: Transaction<TR>) => void;
  /** Updates one or more parameters of an existing transaction in the pool. */
  updateTxParams: (txKey: string, fields: UpdatableTransactionFields<TR>) => void;
  /** Removes a transaction from the tracking pool using its key. */
  removeTxFromPool: (txKey: string) => void;
  /** Closes the tracking modal for a specific transaction. */
  closeTxTrackedModal: (txKey?: string) => void;
  /** Returns the key of the last transaction that was added to the pool. */
  getLastTxKey: () => string | undefined;
}

/**
 * Creates a Zustand store slice containing the core logic for transaction tracking.
 * This function is a slice creator and is meant to be used within `createStore` from Zustand.
 * @param {object} options - Configuration options for the store slice.
 * @param {function} [options.onSucceedCallbacks] - An optional async callback to run when a transaction succeeds.
 * @returns {StoreSlice<IInitializeTxTrackingStore<TR, T>>} A Zustand store slice.
 */
export function initializeTxTrackingStore<TR, T extends Transaction<TR>, A>({
  onSucceedCallbacks,
}: {
  onSucceedCallbacks?: (tx: T) => Promise<void> | void;
}): StoreSlice<IInitializeTxTrackingStore<TR, T, A>> {
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
              pending: true,
            } as Draft<T>;
          }
        }),
      );
    },

    updateTxParams: (txKey, fields) => {
      set((state) =>
        produce(state, (draft) => {
          const tx = draft.transactionsPool[txKey];
          // Ensure the transaction exists before attempting to update
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
