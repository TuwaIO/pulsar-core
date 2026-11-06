/**
 * @file The term of finished transactions in the pool, so a transaction is not kept in the browser without one.
 */

import dayjs from 'dayjs';

import { Transaction, TransactionPool } from '../types';

/** How many days a finished transaction stays in the pool when the app sets no `retentionDays`. */
export const DEFAULT_RETENTION_DAYS = 30;

/**
 * The keys of the oldest finished transactions over the limit of the pool. Pending ones are never evicted, so a tracker can always
 * record its result.
 *
 * @param pool - The transactions by `txKey`.
 * @param maxTransactions - The limit of the pool.
 * @returns The keys to drop.
 * @internal
 */
export function evictedTransactionKeys<T extends Transaction>(pool: TransactionPool<T>, maxTransactions: number): string[] {
  const over = Object.keys(pool).length - maxTransactions;
  if (over <= 0) return [];
  return Object.values(pool)
    .filter((tx) => !tx.pending)
    .sort((a, b) => Number(a.localTimestamp) - Number(b.localTimestamp))
    .slice(0, over)
    .map((tx) => tx.txKey);
}

/**
 * The keys of the finished transactions whose term has run: `retentionDays` after `finishedTimestamp`, or after
 * `localTimestamp` when a transaction has none. Pending transactions are never expired.
 *
 * @param pool - The transactions by `txKey`.
 * @param retentionDays - The term in days, or `null` to keep finished transactions without a term.
 * @param now - The current Unix time in seconds.
 * @returns The keys to drop (empty without a term).
 * @internal
 */
export function expiredTransactionKeys<T extends Transaction>(
  pool: TransactionPool<T>,
  retentionDays: number | null,
  now: number = dayjs().unix(),
): string[] {
  if (retentionDays === null) return [];
  const cutoff = now - retentionDays * 24 * 60 * 60;
  return Object.values(pool)
    .filter((tx) => !tx.pending && (tx.finishedTimestamp ?? tx.localTimestamp) < cutoff)
    .map((tx) => tx.txKey);
}
