/**
 * @file This file contains selector functions for deriving state from the transaction tracking store.
 * Selectors help abstract the state's shape and provide efficient, memoized access to computed data.
 */

import { Transaction } from '../types';
import { TransactionPool } from './initializeTxTrackingStore';

/**
 * Selects all transactions from the pool and sorts them by their creation timestamp in ascending order.
 * @template TR - The type of the tracker identifier.
 * @template T - The transaction type.
 * @param {TransactionPool<TR, T>} transactionsPool - The entire transaction pool from the store.
 * @returns {T[]} An array of all transactions, sorted chronologically.
 */
export const selectAllTransactions = <TR, T extends Transaction<TR>>(transactionsPool: TransactionPool<TR, T>): T[] => {
  return Object.values(transactionsPool).sort((a, b) => Number(a.localTimestamp) - Number(b.localTimestamp));
};

/**
 * Selects all transactions that are currently in a pending state, sorted chronologically.
 * @template TR - The type of the tracker identifier.
 * @template T - The transaction type.
 * @param {TransactionPool<TR, T>} transactionsPool - The entire transaction pool from the store.
 * @returns {T[]} An array of pending transactions.
 */
export const selectPendingTransactions = <TR, T extends Transaction<TR>>(
  transactionsPool: TransactionPool<TR, T>,
): T[] => {
  return selectAllTransactions(transactionsPool).filter((tx) => tx.pending);
};

/**
 * Selects a single transaction from the pool by its unique key (`txKey`).
 * @template TR - The type of the tracker identifier.
 * @template T - The transaction type.
 * @param {TransactionPool<TR, T>} transactionsPool - The entire transaction pool from the store.
 * @param {string} key - The `txKey` of the transaction to retrieve.
 * @returns {T | undefined} The transaction object if found, otherwise undefined.
 */
export const selectTxByKey = <TR, T extends Transaction<TR>>(
  transactionsPool: TransactionPool<TR, T>,
  key: string,
): T | undefined => {
  return transactionsPool[key];
};

/**
 * Selects all transactions initiated by a specific wallet address, sorted chronologically.
 * @template TR - The type of the tracker identifier.
 * @template T - The transaction type.
 * @param {TransactionPool<TR, T>} transactionsPool - The entire transaction pool from the store.
 * @param {string} from - The wallet address (`from` address) to filter transactions by.
 * @returns {T[]} An array of transactions associated with the given wallet.
 */
export const selectAllTransactionsByActiveWallet = <TR, T extends Transaction<TR>>(
  transactionsPool: TransactionPool<TR, T>,
  from: string,
): T[] => {
  // Filters all transactions to find those matching the provided `from` address.
  return selectAllTransactions(transactionsPool).filter((tx) => tx.from.toLowerCase() === from.toLowerCase());
};

/**
 * Selects all pending transactions for a specific wallet address, sorted chronologically.
 * @template TR - The type of the tracker identifier.
 * @template T - The transaction type.
 * @param {TransactionPool<TR, T>} transactionsPool - The entire transaction pool from the store.
 * @param {string} from - The wallet address (`from` address) to filter transactions by.
 * @returns {T[]} An array of pending transactions for the given wallet.
 */
export const selectPendingTransactionsByActiveWallet = <TR, T extends Transaction<TR>>(
  transactionsPool: TransactionPool<TR, T>,
  from: string,
): T[] => {
  // Reuses the `selectAllTransactionsByActiveWallet` selector for efficiency
  // and then filters for pending transactions.
  return selectAllTransactionsByActiveWallet(transactionsPool, from).filter((tx) => tx.pending);
};
