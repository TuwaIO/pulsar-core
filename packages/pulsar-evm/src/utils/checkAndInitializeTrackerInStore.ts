/**
 * @file Routes an EVM transaction of the Pulsar store to the tracker named by its `tracker` field.
 */

import { ITxTrackingStore, TrackerCallbacks, Transaction, TransactionStatus, TransactionTracker } from '@tuwaio/pulsar-core';
import { Config } from '@wagmi/core';
import dayjs from 'dayjs';

import { eip5792TrackerForStore } from '../trackers/eip5792Tracker';
import { erc4337TrackerForStore } from '../trackers/erc4337Tracker';
import { evmTrackerForStore } from '../trackers/evmTracker';
import { safeTrackerForStore } from '../trackers/safeTracker';

/**
 * The parameters of {@link checkAndInitializeTrackerInStore}.
 *
 * @template T - The application transaction type.
 */
export type InitializeTrackerParams<T extends Transaction> = Pick<
  ITxTrackingStore<T>,
  'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'
> &
  Partial<Pick<ITxTrackingStore<T>, 'isTxTracked'>> & {
    /** The wagmi config of the app. */
    config: Config;
    /** The transaction to track. */
    tx: T;
    /** The tracker to run, usually `tx.tracker`. */
    tracker: TransactionTracker;
    /**
     * How long a Safe transaction may stay unexecuted before the Safe tracker gives up (see `SafeTrackerOptions`); `null`
     * waits without a limit, the default, as collecting the signatures of several owners can take days.
     */
    safePendingTimeoutMs?: number | null;
  } & TrackerCallbacks<T>;

/** What older versions saved as the tracker of a Gelato relay task. */
const REMOVED_GELATO_TRACKER = 'gelato';

/** Lets a tracker run on its own: its result reaches the store, and only an error of the tracker itself lands here. */
function inBackground(tracker: Promise<void>): void {
  tracker.catch((error: unknown) => {
    console.error(`[Pulsar] A tracker stopped with an error: ${error instanceof Error ? error.name : 'Unknown'}.`);
  });
}

/**
 * Starts the tracker named by `tracker` for a transaction of the Pulsar store: {@link evmTrackerForStore},
 * {@link erc4337TrackerForStore}, {@link eip5792TrackerForStore} or {@link safeTrackerForStore}. An unknown tracker falls back to
 * the standard EVM tracker with a console warning. A Gelato relay task an older version saved, which nothing can follow any more,
 * ends as `Failed` and says so: its task ID is no hash, and it would have stayed pending for good.
 * `pulsarEvmAdapter` uses it as `checkAndInitializeTrackerInStore`.
 *
 * @template T - The application transaction type.
 * @param params - The tracker, the transaction, the wagmi config, the store members and the callbacks.
 * @returns A promise that resolves once the tracker has started, not when the transaction has finished, as a transaction
 * may stay pending for a long time and nothing should wait for that. Read the result from the store.
 */
export async function checkAndInitializeTrackerInStore<T extends Transaction>({
  tracker,
  tx,
  config,
  transactionsPool,
  onSuccess,
  onError,
  onReplaced,
  safePendingTimeoutMs,
  ...rest
}: InitializeTrackerParams<T>): Promise<void> {
  switch (tracker) {
    case TransactionTracker.Ethereum:
      return inBackground(
        evmTrackerForStore({ tx, config, transactionsPool, onSuccess, onError, onReplaced, ...rest }),
      );

    case TransactionTracker.ERC4337:
      return erc4337TrackerForStore({ tx, config, transactionsPool, onSuccess, onError, onReplaced, ...rest });

    case TransactionTracker.EIP5792:
      return eip5792TrackerForStore({ tx, config, transactionsPool, onSuccess, onError, onReplaced, ...rest });

    case TransactionTracker.Safe:
      // The Safe tracker also uses its own API endpoints.
      return safeTrackerForStore({
        tx,
        transactionsPool,
        onSuccess,
        onError,
        onReplaced,
        pendingTimeoutMs: safePendingTimeoutMs,
        ...rest,
      });

    // The default case handles any unknown or unspecified tracker types.
    // It logs a warning and treats them as standard EVM transactions.
    default:
      if ((tracker as string) === REMOVED_GELATO_TRACKER) {
        const message = 'Gelato relay tasks are no longer followed. Check the result in your wallet or a block explorer.';
        rest.updateTxParams(tx.txKey, {
          status: TransactionStatus.Failed,
          pending: false,
          isError: true,
          error: { message },
          finishedTimestamp: dayjs().unix(),
        } as Parameters<typeof rest.updateTxParams>[1]);
        return;
      }
      console.warn(`Unknown tracker type: '${tracker}'. Falling back to default EVM tracker.`);
      return inBackground(
        evmTrackerForStore({ tx, config, transactionsPool, onSuccess, onError, onReplaced, ...rest }),
      );
  }
}
