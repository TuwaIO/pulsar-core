/**
 * @file Selectors that derive lists of transactions from a transaction pool. They are plain functions: each call
 * returns a new array, so memoize the result (or compare it shallowly) when using it in a React selector.
 */

import { Transaction, TransactionPool } from '../types';

/**
 * Returns every transaction of the pool, oldest first (by `localTimestamp`).
 *
 * @template T - The application transaction type.
 * @param transactionsPool - The transaction pool of the store.
 * @returns A new array of all transactions, sorted chronologically.
 */
export const selectAllTransactions = <T extends Transaction>(transactionsPool: TransactionPool<T>): T[] => {
  return Object.values(transactionsPool).sort((a, b) => Number(a.localTimestamp) - Number(b.localTimestamp));
};

/**
 * Returns the transactions with `pending: true`, oldest first.
 *
 * @template T - The application transaction type.
 * @param transactionsPool - The transaction pool of the store.
 * @returns A new array of pending transactions, sorted chronologically.
 */
export const selectPendingTransactions = <T extends Transaction>(transactionsPool: TransactionPool<T>): T[] => {
  return selectAllTransactions(transactionsPool).filter((tx) => tx.pending);
};

/**
 * Returns the transaction stored under a `txKey`.
 *
 * @template T - The application transaction type.
 * @param transactionsPool - The transaction pool of the store.
 * @param key - The `txKey` of the transaction.
 * @returns The transaction, or `undefined` if the pool has no such key.
 */
export const selectTxByKey = <T extends Transaction>(
  transactionsPool: TransactionPool<T>,
  key: string,
): T | undefined => {
  return transactionsPool[key];
};

/**
 * Returns the transactions sent by a wallet, oldest first. Addresses are compared case-insensitively.
 *
 * @template T - The application transaction type.
 * @param transactionsPool - The transaction pool of the store.
 * @param from - The wallet address to match against the `from` field.
 * @returns A new array of the wallet's transactions, sorted chronologically.
 */
export const selectAllTransactionsByActiveWallet = <T extends Transaction>(
  transactionsPool: TransactionPool<T>,
  from: string,
): T[] => {
  // Filters all transactions to find those matching the provided `from` address.
  return selectAllTransactions(transactionsPool).filter((tx) => tx.from.toLowerCase() === from.toLowerCase());
};

/**
 * Returns the pending transactions sent by a wallet, oldest first. Addresses are compared case-insensitively.
 *
 * @template T - The application transaction type.
 * @param transactionsPool - The transaction pool of the store.
 * @param from - The wallet address to match against the `from` field.
 * @returns A new array of the wallet's pending transactions, sorted chronologically.
 */
export const selectPendingTransactionsByActiveWallet = <T extends Transaction>(
  transactionsPool: TransactionPool<T>,
  from: string,
): T[] => {
  // Reuses the `selectAllTransactionsByActiveWallet` selector for efficiency
  // and then filters for pending transactions.
  return selectAllTransactionsByActiveWallet(transactionsPool, from).filter((tx) => tx.pending);
};
