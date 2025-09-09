/**
 * @file This file contains a utility function that acts as a router to initialize the correct transaction tracker.
 * Based on a transaction's `tracker` property, it delegates the tracking task to the appropriate implementation.
 */

import { ITxTrackingStore, Transaction } from '@tuwaio/pulsar-core';
import { Chain } from 'viem';

import { evmTrackerForStore } from '../trackers/evmTracker';
import { gelatoTrackerForStore } from '../trackers/gelatoTracker';
import { safeTrackerForStore } from '../trackers/safeTracker';
import { ActionTxKey, TransactionTracker } from '../types';

/**
 * The parameters required to initialize a tracker.
 * @template T - The application-specific transaction type.
 */
type InitializeTrackerParams<T extends Transaction<TransactionTracker>> = Pick<
  ITxTrackingStore<TransactionTracker, T, ActionTxKey>,
  'transactionsPool' | 'updateTxParams' | 'onSucceedCallbacks' | 'removeTxFromPool'
> & {
  chains: Chain[];
  tx: T;
  tracker: TransactionTracker;
};

/**
 * Initializes the appropriate tracker for a given transaction based on its `tracker` type.
 * This function acts as a central router, delegating to the specific tracker implementation
 * (e.g., standard EVM, Gelato, or Safe).
 *
 * @template T - The application-specific transaction type, extending the base `Transaction`.
 * @param {InitializeTrackerParams<T>} params - The parameters for initializing the tracker.
 * @returns {Promise<void>} A promise that resolves once the tracking process has been successfully initiated.
 */
export async function checkAndInitializeTrackerInStore<T extends Transaction<TransactionTracker>>({
  tracker,
  tx,
  chains,
  ...rest
}: InitializeTrackerParams<T>): Promise<void> {
  switch (tracker) {
    case TransactionTracker.Ethereum:
      return evmTrackerForStore({ tx, chains, ...rest });

    case TransactionTracker.Gelato:
      // The Gelato tracker does not need the `chains` param as it uses its own API endpoints.
      return gelatoTrackerForStore({ tx, ...rest });

    case TransactionTracker.Safe:
      // The Safe tracker also uses its own API endpoints.
      return safeTrackerForStore({ tx, ...rest });

    // The default case handles any unknown or unspecified tracker types.
    // It logs a warning and treats them as standard EVM transactions.
    default:
      console.warn(`Unknown tracker type: '${tracker}'. Falling back to default EVM tracker.`);
      return evmTrackerForStore({ tx, chains, ...rest });
  }
}
