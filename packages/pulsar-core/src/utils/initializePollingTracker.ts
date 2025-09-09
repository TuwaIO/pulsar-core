/**
 * @file This file provides a generic utility for creating a polling mechanism to track
 * asynchronous tasks, such as API-based transaction status checks (e.g., for Gelato or Safe).
 */

import { Transaction } from '../types';

/**
 * Defines the parameters for the fetcher function used within the polling tracker.
 * The fetcher is the core logic that performs the actual API call.
 * @template R - The expected type of the successful API response.
 * @template T - The type of the transaction object being tracked.
 */
type PollingFetcherParams<R, T> = {
  /** The transaction object being tracked. */
  tx: T;
  /** A callback to stop the polling mechanism, typically called on success or terminal failure. */
  stopPolling: (options?: { withoutRemoving?: boolean }) => void;
  /** Callback to be invoked when the fetcher determines the transaction has succeeded. */
  onSuccess: (response: R) => void;
  /** Callback to be invoked when the fetcher determines the transaction has failed. */
  onFailure: (response?: R) => void;
  /** Optional callback for each successful poll, useful for updating UI with intermediate states. */
  onIntervalTick?: (response: R) => void;
  /** Optional callback for when a transaction is replaced (e.g., speed-up). */
  onReplaced?: (response: R) => void;
};

/**
 * Defines the configuration object for the `initializePollingTracker` function.
 * @template R - The expected type of the successful API response.
 * @template T - The type of the transaction object.
 * @template TR - The type of the tracker identifier.
 */
export type PollingTrackerConfig<R, T, TR> = {
  /** The transaction object to be tracked. It must include `txKey` and `pending` status. */
  tx: T & Pick<Transaction<TR>, 'txKey' | 'pending'>;
  /** The function that performs the data fetching (e.g., an API call) on each interval. */
  fetcher: (params: PollingFetcherParams<R, T>) => Promise<void>;
  /** Callback to be invoked when the transaction successfully completes. */
  onSuccess: (response: R) => void;
  /** Callback to be invoked when the transaction fails. */
  onFailure: (response?: R) => void;
  /** Optional callback executed once when the tracker is initialized. */
  onInitialize?: () => void;
  /** Optional callback for each successful poll. */
  onIntervalTick?: (response: R) => void;
  /** Optional callback for when a transaction is replaced. */
  onReplaced?: (response: R) => void;
  /** Optional function to remove the transaction from the main pool, typically after polling stops. */
  removeTxFromPool?: (txKey: string) => void;
  /** The interval (in milliseconds) between polling attempts. Defaults to 5000ms. */
  pollingInterval?: number;
  /** The number of consecutive failed fetches before stopping the tracker. Defaults to 10. */
  maxRetries?: number;
};

const DEFAULT_POLLING_INTERVAL = 5000;
const DEFAULT_MAX_RETRIES = 10;

/**
 * Initializes a generic polling tracker that repeatedly calls a fetcher function
 * to monitor the status of an asynchronous task.
 *
 * This function handles the lifecycle of polling, including starting, stopping,
 * and automatic termination after a certain number of failed attempts.
 *
 * @template R The expected type of the API response.
 * @template T The type of the transaction object.
 * @template TR The type of the tracker identifier.
 * @param {PollingTrackerConfig<R, T, TR>} config - The configuration for the tracker.
 */
export function initializePollingTracker<R, T, TR>(config: PollingTrackerConfig<R, T, TR>): void {
  const {
    tx,
    fetcher,
    onInitialize,
    onSuccess,
    onFailure,
    onIntervalTick,
    onReplaced,
    removeTxFromPool,
    pollingInterval = DEFAULT_POLLING_INTERVAL,
    maxRetries = DEFAULT_MAX_RETRIES,
  } = config;

  // 1. Early exit if the transaction is no longer pending
  if (!tx.pending) {
    return;
  }

  // Execute the initialization callback if provided
  onInitialize?.();

  let retriesLeft = maxRetries;
  let isPolling = true;

  /**
   * Stops the polling interval and optionally removes the transaction from the pool.
   * @param {object} [options] - Options for stopping the tracker.
   * @param {boolean} [options.withoutRemoving=false] - If true, the tx will not be removed from the pool.
   */
  const stopPolling = (options?: { withoutRemoving?: boolean }) => {
    if (!isPolling) return;
    isPolling = false;
    // The interval is cleared in the finally block of the polling loop
    if (removeTxFromPool && !options?.withoutRemoving) {
      removeTxFromPool(tx.txKey);
    }
  };

  const pollingLoop = async () => {
    while (isPolling && retriesLeft > 0) {
      try {
        await new Promise((resolve) => setTimeout(resolve, pollingInterval));
        if (!isPolling) break;

        // The fetcher's responsibility is to call onSuccess, onFailure, etc., which in turn call stopPolling.
        await fetcher({
          tx,
          stopPolling,
          onSuccess,
          onFailure,
          onIntervalTick,
          onReplaced,
        });
      } catch (error) {
        console.error(`Polling fetcher for txKey ${tx.txKey} threw an error:`, error);
        retriesLeft--;
      }
    }

    if (retriesLeft <= 0) {
      console.warn(`Polling for txKey ${tx.txKey} stopped after reaching the maximum number of retries.`);
      onFailure();
      stopPolling();
    }
  };

  // Start the asynchronous polling loop
  pollingLoop();
}
