/**
 * @file This file contains a utility function that acts as a router to initialize the correct transaction tracker.
 * Based on a transaction's `tracker` property, it delegates the tracking task to the appropriate implementation.
 */

import { ITxTrackingStore, OnSuccessCallback, Transaction, TransactionTracker } from '@tuwaio/pulsar-core';
import { Config } from '@wagmi/core';

import { evmTrackerForStore } from '../trackers/evmTracker';
import { gelatoTrackerForStore } from '../trackers/gelatoTracker';
import { safeTrackerForStore } from '../trackers/safeTracker';

/**
 * The parameters required to initialize a tracker.
 * @template T - The application-specific transaction type.
 */
type InitializeTrackerParams<T extends Transaction> = Pick<
  ITxTrackingStore<T>,
  'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'
> & {
  config: Config;
  tx: T;
  tracker: TransactionTracker;
} & OnSuccessCallback<T>;

/**
 * Initializes the appropriate tracker for a given transaction based on its `tracker` type.
 * This function acts as a central router, delegating to the specific tracker implementation
 * (e.g., standard EVM, Gelato, or Safe).
 *
 * @template T - The application-specific transaction type, extending the base `Transaction`.
 * @param {InitializeTrackerParams<T>} params - The parameters for initializing the tracker.
 * @returns {Promise<void>} A promise that resolves once the tracking process has been successfully initiated.
 */
export async function checkAndInitializeTrackerInStore<T extends Transaction>({
  tracker,
  tx,
  config,
  transactionsPool,
  onSuccessCallback,
  ...rest
}: InitializeTrackerParams<T>): Promise<void> {
  switch (tracker) {
    case TransactionTracker.Ethereum:
      return evmTrackerForStore({ tx, config, transactionsPool, onSuccessCallback, ...rest });

    case TransactionTracker.Gelato:
      // The Gelato tracker does not need the `chains` param as it uses its own API endpoints.
      return gelatoTrackerForStore({ tx, transactionsPool, onSuccessCallback, ...rest });

    case TransactionTracker.Safe:
      // The Safe tracker also uses its own API endpoints.
      return safeTrackerForStore({ tx, transactionsPool, onSuccessCallback, ...rest });

    // The default case handles any unknown or unspecified tracker types.
    // It logs a warning and treats them as standard EVM transactions.
    default:
      console.warn(`Unknown tracker type: '${tracker}'. Falling back to default EVM tracker.`);
      return evmTrackerForStore({ tx, config, transactionsPool, onSuccessCallback, ...rest });
  }
}
