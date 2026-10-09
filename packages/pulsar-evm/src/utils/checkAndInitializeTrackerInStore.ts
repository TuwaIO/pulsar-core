/**
 * @file Routes an EVM transaction of the Pulsar store to the tracker named by its `tracker` field.
 */

import { ITxTrackingStore, TrackerCallbacks, Transaction, TransactionTracker } from '@tuwaio/pulsar-core';
import { Config } from '@wagmi/core';

import { eip5792TrackerForStore } from '../trackers/eip5792Tracker';
import { erc4337TrackerForStore } from '../trackers/erc4337Tracker';
import { evmTrackerForStore } from '../trackers/evmTracker';
import { gelatoTrackerForStore } from '../trackers/gelatoTracker';
import { safeTrackerForStore } from '../trackers/safeTracker';

/**
 * The parameters of {@link checkAndInitializeTrackerInStore}.
 *
 * @template T - The application transaction type.
 */
export type InitializeTrackerParams<T extends Transaction> = Pick<
  ITxTrackingStore<T>,
  'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'
> & {
  /** The wagmi config of the app. */
  config: Config;
  /** The transaction to track. */
  tx: T;
  /** The tracker to run, usually `tx.tracker`. */
  tracker: TransactionTracker;
  /** @deprecated Gelato API key; required to run the Gelato tracker. */
  gelatoApiKey?: string;
} & TrackerCallbacks<T>;

/**
 * Starts the tracker named by `tracker` for a transaction of the Pulsar store: {@link evmTrackerForStore},
 * {@link erc4337TrackerForStore}, {@link eip5792TrackerForStore}, {@link safeTrackerForStore} or
 * {@link gelatoTrackerForStore}. A Gelato transaction
 * without `gelatoApiKey`, or an unknown tracker, falls back to the standard EVM tracker with a console warning.
 * `pulsarEvmAdapter` uses it as `checkAndInitializeTrackerInStore`.
 *
 * @template T - The application transaction type.
 * @param params - The tracker, the transaction, the wagmi config, the store members and the callbacks.
 * @returns The promise of the started tracker. For the standard EVM tracker it resolves only when tracking has
 * finished; polling trackers resolve once polling has started.
 */
export async function checkAndInitializeTrackerInStore<T extends Transaction>({
  tracker,
  tx,
  config,
  transactionsPool,
  onSuccess,
  onError,
  onReplaced,
  gelatoApiKey,
  ...rest
}: InitializeTrackerParams<T>): Promise<void> {
  switch (tracker) {
    case TransactionTracker.Ethereum:
      return evmTrackerForStore({ tx, config, transactionsPool, onSuccess, onError, onReplaced, ...rest });

    case TransactionTracker.ERC4337:
      return erc4337TrackerForStore({ tx, config, transactionsPool, onSuccess, onError, onReplaced, ...rest });

    case TransactionTracker.EIP5792:
      return eip5792TrackerForStore({ tx, config, transactionsPool, onSuccess, onError, onReplaced, ...rest });

    case TransactionTracker.Gelato:
      // If no Gelato API key is provided, fall back to the default EVM tracker.
      if (!gelatoApiKey) {
        console.warn(
          `Gelato tracker requested for tx '${tx.txKey}', but no 'gelatoApiKey' was provided. Falling back to default EVM tracker.`,
        );
        return evmTrackerForStore({ tx, config, transactionsPool, onSuccess, onError, onReplaced, ...rest });
      }
      // The Gelato tracker does not need the `chains` param as it uses its own API endpoints.
      return gelatoTrackerForStore({ tx, transactionsPool, onSuccess, onError, gelatoApiKey, ...rest });

    case TransactionTracker.Safe:
      // The Safe tracker also uses its own API endpoints.
      return safeTrackerForStore({ tx, transactionsPool, onSuccess, onError, onReplaced, ...rest });

    // The default case handles any unknown or unspecified tracker types.
    // It logs a warning and treats them as standard EVM transactions.
    default:
      console.warn(`Unknown tracker type: '${tracker}'. Falling back to default EVM tracker.`);
      return evmTrackerForStore({ tx, config, transactionsPool, onSuccess, onError, onReplaced, ...rest });
  }
}
