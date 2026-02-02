/**
 * @file This file contains the primary router for initializing transaction trackers.
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
 * Initializes the correct background tracker for a given Solana transaction.
 * This function acts as a router, selecting the appropriate tracker based on the `tx.tracker` property.
 *
 * @template T - The transaction type.
 * @param {object} params - The parameters for initializing the tracker.
 * @param {T} params.tx - The transaction object to be tracked.
 * @param {TransactionTracker} params.tracker - The specific tracker to use.
 * @param {object} params.rest - The rest of the store's methods and state needed by the tracker.
 * @returns {Promise<void>} A promise that resolves when the tracker has been initialized.
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
