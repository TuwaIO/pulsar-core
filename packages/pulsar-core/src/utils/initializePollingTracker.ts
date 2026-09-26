/**
 * @file A generic polling loop for trackers that check a transaction through an API or RPC method (Safe, Gelato,
 * ERC-4337 bundlers, Solana).
 */

import { Transaction } from '../types';

/**
 * The argument passed to a polling fetcher on every tick. The fetcher checks the transaction once and reports the result
 * through the callbacks.
 *
 * @template R - The response type the fetcher reports.
 * @template T - The tracked transaction type.
 */
export type PollingFetcherParams<R, T> = {
  /** The tracked transaction, as passed to `initializePollingTracker`. */
  tx: T;
  /**
   * Stops polling. Unless `withoutRemoving` is `true`, it also calls `removeTxFromPool` (if configured) with the
   * transaction key.
   * @param options - Stop options.
   */
  stopPolling: (options?: {
    /** Keep the transaction in the pool. Defaults to `false`. */
    withoutRemoving?: boolean;
  }) => void;
  /**
   * The `onSuccess` callback of the tracker configuration.
   * @param response - The result of the check.
   */
  onSuccess: (response: R) => void;
  /**
   * The `onFailure` callback of the tracker configuration.
   * @param response - The result of the check, if any.
   */
  onFailure: (response?: R) => void;
  /**
   * The `onIntervalTick` callback of the tracker configuration, if any.
   * @param response - The intermediate result.
   */
  onIntervalTick?: (response: R) => void;
  /**
   * The `onReplaced` callback of the tracker configuration, if any.
   * @param response - The result describing the replacement.
   */
  onReplaced?: (response: R) => void;
};

/**
 * The configuration of `initializePollingTracker`.
 *
 * @template R - The response type the fetcher reports.
 * @template T - The tracked transaction type; only `txKey` and `pending` are required.
 */
export type PollingTrackerConfig<R, T extends Pick<Transaction, 'txKey' | 'pending'>> = {
  /** The transaction to track. Polling starts only if `pending` is `true`. */
  tx: T;
  /**
   * Checks the transaction once per tick and reports through the callbacks it receives. It must call `stopPolling` on a
   * terminal result. A thrown error counts as a failed attempt.
   * @param params - The transaction, `stopPolling` and the callbacks.
   */
  fetcher: (params: PollingFetcherParams<R, T>) => Promise<void>;
  /**
   * Called by the fetcher when the transaction succeeded.
   * @param response - The result reported by the fetcher.
   */
  onSuccess: (response: R) => void;
  /**
   * Called by the fetcher when the transaction failed, and without arguments by the tracker after `maxRetries`
   * consecutive failed attempts.
   * @param response - The result reported by the fetcher, if any.
   */
  onFailure: (response?: R) => void;
  /** Called once, synchronously, when polling starts. */
  onInitialize?: () => void;
  /**
   * Called by the fetcher with intermediate results.
   * @param response - The intermediate result.
   */
  onIntervalTick?: (response: R) => void;
  /**
   * Called by the fetcher when the transaction was replaced.
   * @param response - The result describing the replacement.
   */
  onReplaced?: (response: R) => void;
  /**
   * Called when polling stops, unless it was stopped with `withoutRemoving: true`.
   * @param txKey - The `txKey` of the tracked transaction.
   */
  removeTxFromPool?: (txKey: string) => void;
  /** The delay before each attempt, in milliseconds. Defaults to 5000. */
  pollingInterval?: number;
  /** The number of consecutive failed attempts (thrown errors) after which polling stops. Defaults to 10. */
  maxRetries?: number;
};

const DEFAULT_POLLING_INTERVAL = 5000;
const DEFAULT_MAX_RETRIES = 10;

/**
 * Starts polling a transaction in the background and returns immediately. Does nothing if `tx.pending` is `false`.
 *
 * Every `pollingInterval` milliseconds (the first attempt also waits) it calls `fetcher`. Polling continues until the
 * fetcher calls `stopPolling`. A fetcher that throws counts as a failed attempt; after `maxRetries` consecutive failed
 * attempts the tracker calls `onFailure()` without arguments, logs a warning and stops (which calls
 * `removeTxFromPool`, if configured). A successful attempt resets the count.
 *
 * Side effects: runs a timer loop until it is stopped; there is no way to cancel it from the outside.
 *
 * @template R - The response type the fetcher reports.
 * @template T - The tracked transaction type.
 * @param config - The transaction, the fetcher and the callbacks.
 *
 * @example
 * ```ts
 * initializePollingTracker<string, { txKey: string; pending: boolean }>({
 *   tx: { txKey: taskId, pending: true },
 *   fetcher: async ({ tx, stopPolling, onSuccess, onFailure }) => {
 *     const status = await getTaskStatus(tx.txKey); // your API call; throw on network errors
 *     if (status === 'done') onSuccess(status);
 *     if (status === 'failed') onFailure(status);
 *     if (status !== 'pending') stopPolling({ withoutRemoving: true });
 *   },
 *   onSuccess: () => console.log('Done'),
 *   onFailure: () => console.log('Failed'),
 * });
 * ```
 */
export function initializePollingTracker<R, T extends Pick<Transaction, 'txKey' | 'pending'>>(
  config: PollingTrackerConfig<R, T>,
): void {
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
        // Only consecutive failures count towards `maxRetries`.
        retriesLeft = maxRetries;
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
