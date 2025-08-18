/**
 * @file This file contains a generic utility for creating a polling mechanism to track asynchronous tasks,
 * such as API-based transaction status checks (e.g., for Gelato or Safe).
 */

import { Transaction } from '../types';

/**
 * Defines the configuration object for the `initializePollingTracker` function.
 * @template R The expected type of the successful API response from the fetcher.
 * @template T The type of the transaction object being tracked.
 * @template TR The type of the tracker identifier used in the `Transaction` type.
 */
export type InitializePollingTracker<R, T, TR> = {
  /** The transaction object to be tracked. It must include `txKey` and an optional `pending` status. */
  tx: T & Pick<Transaction<TR>, 'txKey'> & { pending?: boolean };
  /** The function that performs the actual data fetching (e.g., an API call). */
  fetcher: (params: {
    /** The transaction object being tracked. */
    tx: T;
    /** A callback to stop the polling mechanism, typically called on success or terminal failure. */
    clearWatch: (withoutRemoving?: boolean) => void;
    /** Callback to be invoked when the fetcher determines the transaction has succeeded. */
    onSucceed: (response: R) => void;
    /** Callback to be invoked when the fetcher determines the transaction has failed. */
    onFailed: (response: R) => void;
    /** Optional callback for each successful poll, useful for updating UI with intermediate states. */
    onIntervalTick?: (response: R) => void;
    /** Optional callback for when a transaction is replaced by another. */
    onReplaced?: (response: R) => void;
  }) => Promise<Response>;

  /** Optional callback executed once when the tracker is initialized. */
  onInitialize?: () => void;
  /** Callback to be invoked when the transaction has succeeded. */
  onSucceed: (response: R) => void;
  /** Callback to be invoked when the transaction has failed. */
  onFailed: (response: R) => void;
  /** Optional callback for each successful poll. */
  onIntervalTick?: (response: R) => void;
  /** Optional callback for when a transaction is replaced. */
  onReplaced?: (response: R) => void;
  /** Optional function to remove the transaction from the main pool, typically after polling stops. */
  removeTxFromPool?: (taskId: string) => void;
  /** The interval (in milliseconds) between polling attempts. Defaults to 5000ms. */
  pollingInterval?: number;
  /** The number of consecutive failed fetches before stopping the tracker. Defaults to 10. */
  retryCount?: number;
};

/**
 * Initializes a generic polling tracker that repeatedly calls a fetcher function
 * to monitor the status of a transaction or any asynchronous task.
 *
 * @template R The expected type of the successful API response.
 * @template T The type of the transaction object.
 * @template TR The type of the tracker identifier.
 * @param {InitializePollingTracker<R, T, TR>} params - The configuration object for the tracker.
 * @returns {Promise<void>} A promise that resolves when the tracker is set up (note: polling happens asynchronously).
 */
export async function initializePollingTracker<R, T, TR>({
  onInitialize,
  tx,
  removeTxFromPool,
  fetcher,
  onFailed,
  onIntervalTick,
  onSucceed,
  pollingInterval,
  retryCount,
  onReplaced,
}: InitializePollingTracker<R, T, TR>): Promise<void> {
  if (onInitialize) {
    onInitialize();
  }

  // Early exit if the transaction is not pending
  if (!tx?.pending) {
    return;
  }

  let pollingIntervalId: number | undefined;

  /**
   * Stops the polling interval and optionally removes the transaction from the pool.
   * @param {boolean} [withoutRemoving=false] - If true, the transaction will not be removed from the pool.
   */
  const clearWatch = (withoutRemoving?: boolean) => {
    clearInterval(pollingIntervalId);
    if (removeTxFromPool && !withoutRemoving) {
      removeTxFromPool(tx.txKey);
    }
  };

  let retriesLeft = retryCount ?? 10;

  pollingIntervalId = window.setInterval(async () => {
    if (retriesLeft <= 0) {
      clearWatch();
      return;
    }

    try {
      const response = await fetcher({
        tx,
        onSucceed,
        onFailed,
        onIntervalTick,
        onReplaced,
        clearWatch,
      });

      // If the API call fails (e.g., 404 Not Found), decrement the retry counter.
      // The fetcher itself is responsible for calling `clearWatch` on terminal statuses.
      if (!response.ok) {
        retriesLeft--;
      }
    } catch (error) {
      console.error('Polling fetcher function threw an error:', error);
      retriesLeft--;
    }
  }, pollingInterval ?? 5000);
}
