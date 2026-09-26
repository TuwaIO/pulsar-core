/**
 * @file Helper for store-connected trackers that keeps their copy of a transaction in sync with the fields they write.
 */

import { ITxTrackingStore, Transaction, UpdatableTransactionFields } from '../types';

/**
 * Creates an updater for a store-connected tracker: it writes fields to the store with `updateTxParams` and returns the
 * tracked transaction with every update applied so far.
 *
 * The `transactionsPool` a tracker receives is a snapshot taken when tracking starts, and Immer replaces the pool on
 * every update, so reading the snapshot after `updateTxParams` returns stale data. Pass the object returned here to
 * `TrackerCallbacks` instead. The built-in trackers of `@tuwaio/pulsar-evm` and `@tuwaio/pulsar-solana` use it; use it
 * in custom trackers too.
 *
 * @template T - The application transaction type.
 * @param params - The tracked transaction and the store members used by trackers.
 * @param params.tx - The tracked transaction.
 * @param params.transactionsPool - The pool snapshot; the tracked transaction is read from it once.
 * @param params.updateTxParams - The store's `updateTxParams`.
 * @returns A function that calls `updateTxParams(tx.txKey, fields)` and returns the updated transaction, or `undefined`
 * when the transaction was not in the pool when tracking started. The snapshot is not mutated.
 *
 * @example
 * ```ts
 * const updateTx = createTxUpdater({ tx, transactionsPool, updateTxParams });
 * const updatedTx = updateTx({ status: TransactionStatus.Success, pending: false });
 * if (updatedTx) onSuccess?.(updatedTx);
 * ```
 */
export function createTxUpdater<T extends Transaction>({
  tx,
  transactionsPool,
  updateTxParams,
}: Pick<ITxTrackingStore<T>, 'transactionsPool' | 'updateTxParams'> & { tx: T }) {
  let current: T | undefined = transactionsPool[tx.txKey];

  return (fields: UpdatableTransactionFields): T | undefined => {
    updateTxParams(tx.txKey, fields);
    if (current) current = { ...current, ...fields } as T;
    return current;
  };
}
