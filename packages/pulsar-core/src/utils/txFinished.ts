/**
 * @file Helpers of the "transaction finished" event of the Pulsar store (`onTxFinished`, `subscribeTxFinished`).
 */

import { Transaction, TransactionStatus, TxFinishedListener } from '../types';

/**
 * Whether a status is final: `Success`, `Failed` or `Replaced`.
 *
 * @internal
 * @param status - The status of a transaction.
 * @returns `true` for a final status.
 */
export const isFinishedStatus = (status?: TransactionStatus): boolean =>
  status === TransactionStatus.Success || status === TransactionStatus.Failed || status === TransactionStatus.Replaced;

/**
 * Creates the listener registry of a store: the `onTxFinished` option plus the listeners added with
 * `subscribeTxFinished`. A listener that throws or rejects is logged with `console.error`; the others still run and the
 * caller is never interrupted. Promises are not awaited.
 *
 * @internal
 * @template T - The application transaction type.
 * @param onTxFinished - The `onTxFinished` option of `createPulsarStore`, called before the subscribers.
 * @returns `notify` to call once per finished transaction, and `subscribe`, which returns the unsubscribe function.
 */
export function createTxFinishedNotifier<T extends Transaction>(onTxFinished?: TxFinishedListener<T>) {
  const listeners = new Set<TxFinishedListener<T>>();

  const report = (error: unknown) => console.error('[Pulsar] A transaction finished listener failed:', error);

  const notify = (tx: T) => {
    for (const listener of onTxFinished ? [onTxFinished, ...listeners] : [...listeners]) {
      try {
        const result = listener(tx);
        if (result && typeof result.then === 'function') {
          result.then(undefined, report);
        }
      } catch (error) {
        report(error);
      }
    }
  };

  const subscribe = (listener: TxFinishedListener<T>) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return { notify, subscribe };
}
