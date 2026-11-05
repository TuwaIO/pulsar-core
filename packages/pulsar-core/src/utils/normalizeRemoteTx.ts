/**
 * @file Brings a transaction from a remote history to the shape of a pool record.
 */

import { Transaction } from '../types';

const NUMERIC_FIELDS = ['localTimestamp', 'finishedTimestamp', 'requiredConfirmations', 'confirmations'] as const;

/**
 * A database row is not a pool record: its numbers can come as strings and its empty columns as `null`. Kept as they are,
 * they break what reads them, and whatever is built from the record is refused by the same backend when sent back.
 *
 * @internal
 * @template T - The application transaction type.
 * @param tx - The transaction from the remote history.
 * @returns A copy with no `null` fields and with numbers as numbers.
 */
export function normalizeRemoteTx<T extends Transaction>(tx: T): T {
  const record = Object.fromEntries(Object.entries(tx).filter(([, value]) => value !== null)) as Record<
    string,
    unknown
  >;
  for (const field of NUMERIC_FIELDS) {
    const value = record[field];
    if (typeof value === 'string' && value !== '' && Number.isFinite(Number(value))) record[field] = Number(value);
  }
  return record as T;
}
