/**
 * @file Routes a Solana transaction of the Pulsar store to its tracker.
 */

import { normalizeError } from '@tuwaio/orbit-core';
import {
  ITxTrackingStore,
  TrackerCallbacks,
  Transaction,
  TransactionStatus,
  TransactionTracker,
} from '@tuwaio/pulsar-core';

import { solanaTrackerForStore } from '../trackers/solanaTracker';

/**
 * Starts {@link solanaTrackerForStore} when `tracker` is `TransactionTracker.Solana`. Any other tracker logs an error
 * and marks the transaction `Failed` (without calling `onError`). `pulsarSolanaAdapter` uses it as
 * `checkAndInitializeTrackerInStore`.
 *
 * @template T - The application transaction type.
 * @param params - The tracker, the transaction, the store members and the callbacks.
 * @param params.tx - The transaction to track.
 * @param params.tracker - The tracker to run, usually `tx.tracker`.
 * @param params.onSuccess - Called when the transaction is finalized.
 * @param params.onError - Called when the transaction failed or tracking gave up.
 * @param params.updateTxParams - The store's `updateTxParams`.
 * @param params.removeTxFromPool - The store's `removeTxFromPool`.
 * @param params.transactionsPool - The store's pool when tracking starts.
 * @returns A promise that resolves once polling has started.
 */
export async function checkAndInitializeTrackerInStore<T extends Transaction>({
  tx,
  tracker,
  onSuccess,
  onError,
  ...rest
}: {
  tx: T;
  tracker: TransactionTracker;
} & TrackerCallbacks<T> &
  Pick<ITxTrackingStore<T>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'>): Promise<void> {
  switch (tracker) {
    case TransactionTracker.Solana:
      await solanaTrackerForStore({
        tx,
        onSuccess,
        onError,
        ...rest,
      });
      break;
    default:
      console.error(`Unknown tracker type for Solana adapter: ${tracker}`);
      // If an unsupported tracker is specified, mark the transaction as failed.
      rest.updateTxParams(tx.txKey, {
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        error: normalizeError(new Error(`Unsupported tracker type: "${tracker}"`)),
      });
      break;
  }
}
