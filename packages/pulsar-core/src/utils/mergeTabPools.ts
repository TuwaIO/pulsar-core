/**
 * @file Merges the pool another tab of the same store has saved into this tab's pool.
 */

import { Transaction, TransactionPool, TransactionStatus } from '../types';
import { isFinishedStatus } from './txFinished';

/** A `Failed` can come from a tracker or a server that lost sight of a transaction; these two only from the chain. */
const fromTheChain = (status?: TransactionStatus) =>
  status === TransactionStatus.Success || status === TransactionStatus.Replaced;

/**
 * Whether a final status may be overwritten by `next`. A final result stays, as a late writer only lost sight of the
 * transaction, except a `Failed` that the chain now answers otherwise: it may have come from a time limit.
 *
 * @internal
 * @param current - The status the transaction has.
 * @param next - The status being written.
 * @returns `true` when the result fields of the write must be dropped.
 */
export const keepsItsResult = (current?: TransactionStatus, next?: TransactionStatus): boolean =>
  isFinishedStatus(current) && !(current === TransactionStatus.Failed && fromTheChain(next));

/**
 * Merges the saved pool of another tab into this tab's pool, by transaction. Every change saves the whole pool, so the
 * saved one can lag behind this tab, or lack what it has just added. A plain rehydrate would make a tab lose a pending
 * transaction, or take a final status back to pending:
 * - a transaction only this tab knows stays;
 * - a final result is never replaced by a pending copy;
 * - a final result of the other tab replaces this tab's pending copy (and a `Failed`, when the chain said otherwise);
 * - of two pending copies this tab's values win, and it learns the fields only the other tab has.
 *
 * Nothing changes when the saved pool has nothing new, which is what ends the exchange between two tabs: a tab saves only
 * when it has learned something.
 *
 * @internal
 * @template T - The application transaction type.
 * @param current - This tab's pool.
 * @param saved - The pool another tab saved.
 * @returns The merged pool (`current` itself when nothing changed), the keys that have just become final here, and
 * the pending transactions this tab did not know.
 */
export function mergeTabPools<T extends Transaction>(
  current: TransactionPool<T>,
  saved: TransactionPool<T>,
): { pool: TransactionPool<T>; finished: string[]; added: T[] } {
  const pool: TransactionPool<T> = { ...current };
  const finished: string[] = [];
  const added: T[] = [];
  let changed = false;

  for (const [key, theirs] of Object.entries(saved)) {
    const ours = current[key];
    if (!ours) {
      pool[key] = theirs;
      if (theirs.pending) added.push(theirs);
      changed = true;
    } else if (isFinishedStatus(theirs.status) && !keepsItsResult(ours.status, theirs.status)) {
      if (ours.status === theirs.status) continue;
      pool[key] = theirs;
      finished.push(key);
      changed = true;
    } else if (!isFinishedStatus(ours.status) && !isFinishedStatus(theirs.status)) {
      const learned = Object.entries(theirs).some(
        ([field, value]) => value !== undefined && ours[field as keyof T] === undefined,
      );
      if (learned) {
        pool[key] = { ...theirs, ...ours };
        changed = true;
      }
    }
  }

  return { pool: changed ? pool : current, finished, added };
}
