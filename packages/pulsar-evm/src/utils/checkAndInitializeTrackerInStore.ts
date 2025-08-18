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
 * Initializes the appropriate tracker for a given transaction based on its `tracker` type.
 * This function acts as a central router, delegating to the specific tracker implementation
 * (e.g., EVM, Gelato, Safe).
 *
 * @template T - The application-specific transaction union type.
 * @param {object} params - The parameters for initializing the tracker.
 * @param {TransactionTracker} params.tracker - The type of tracker to use for the transaction.
 * @param {T} params.tx - The transaction object to be tracked.
 * @param {Chain[]} params.chains - An array of supported chain objects, required for some trackers (like the EVM tracker).
 * @param {object} params.rest - The rest of the parameters, which are the relevant methods from the Zustand store
 * (`transactionsPool`, `updateTxParams`, `onSucceedCallbacks`, `removeTxFromPool`).
 * @returns {Promise<void>} A promise that resolves once the tracking process has been initiated.
 */
export async function checkAndInitializeTrackerInStore<T extends Transaction<TransactionTracker>>({
  tracker,
  tx,
  chains,
  ...rest
}: Pick<
  ITxTrackingStore<TransactionTracker, T, ActionTxKey>,
  'transactionsPool' | 'updateTxParams' | 'onSucceedCallbacks' | 'removeTxFromPool'
> & {
  chains: Chain[];
  tx: T;
  tracker: TransactionTracker;
}): Promise<void> {
  switch (tracker) {
    case TransactionTracker.Ethereum:
      await evmTrackerForStore({
        tx,
        chains,
        ...rest,
      });
      break;

    case TransactionTracker.Gelato:
      // The Gelato tracker does not need the `chains` param as it uses its own API endpoints.
      await gelatoTrackerForStore({
        tx,
        ...rest,
      });
      break;

    case TransactionTracker.Safe:
      // The Safe tracker also uses its own API endpoints.
      await safeTrackerForStore({
        tx,
        ...rest,
      });
      break;

    // The default case handles any unknown or unspecified tracker types as standard EVM transactions.
    default:
      await evmTrackerForStore({
        tx,
        chains,
        ...rest,
      });
  }
}
