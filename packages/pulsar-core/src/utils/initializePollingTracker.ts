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
  /**
   * The delay before each attempt, in milliseconds, or a function that returns it from the milliseconds elapsed since
   * polling started, to poll less often over time. Defaults to 5000.
   */
  pollingInterval?: number | ((elapsedMs: number) => number);
  /** The number of consecutive failed attempts (thrown errors) after which polling stops. Defaults to 10. */
  maxRetries?: number;
  /**
   * With a delay here, `maxRetries` consecutive failed attempts no longer end tracking: the tracker keeps asking at this
   * delay, in milliseconds, until an attempt succeeds. Not being able to ask says nothing about the transaction, so use
   * it where a person would otherwise be told that a transaction failed because a service was down.
   */
  retryForeverEveryMs?: number;
  /**
   * Asked before every check. `true` stops polling without any callback: nothing reads the result any more, for example
   * as the transaction was removed from the pool.
   * @returns Whether to stop.
   */
  isAbandoned?: () => boolean;
};

/**
 * Thrown by a fetcher when no later check can change the answer, such as a chain the service does not cover: the tracker
 * calls `onFailure()` and stops at once, also with `retryForeverEveryMs`. Any other error counts as a failed attempt.
 */
export class FinalPollingError extends Error {
  override name = 'FinalPollingError';
}

const DEFAULT_POLLING_INTERVAL = 5000;
const DEFAULT_MAX_RETRIES = 10;

/**
 * Starts polling a transaction in the background and returns immediately. Does nothing if `tx.pending` is `false`.
 *
 * Every `pollingInterval` milliseconds (the first attempt also waits; a function is asked before each wait) it calls
 * `fetcher`. Polling continues until the
 * fetcher calls `stopPolling`. A fetcher that throws counts as a failed attempt; after `maxRetries` consecutive failed
 * attempts the tracker calls `onFailure()` without arguments, logs a warning and stops (which calls
 * `removeTxFromPool`, if configured), or, with `retryForeverEveryMs`, keeps asking at that delay. A successful attempt
 * resets the count. A {@link FinalPollingError} ends it at once. An error thrown by a callback is logged and is not a
 * failed attempt, as the fetcher would then report the same result again on the next tick.
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
    retryForeverEveryMs,
    isAbandoned,
  } = config;

  // 1. Early exit if the transaction is no longer pending
  if (!tx.pending) {
    return;
  }

  // Execute the initialization callback if provided
  onInitialize?.();

  let retriesLeft = maxRetries;
  let isPolling = true;
  const startedAt = Date.now();
  const nextDelay = () =>
    typeof pollingInterval === 'function' ? pollingInterval(Date.now() - startedAt) : pollingInterval;

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

  const guarded = <A extends unknown[]>(name: string, callback: ((...args: A) => unknown) | undefined) =>
    ((...args: A) => {
      const log = (error: unknown) => console.error(`[Pulsar] ${name} callback threw for ${tx.txKey}:`, error);
      try {
        void Promise.resolve(callback?.(...args)).catch(log);
      } catch (error) {
        log(error);
      }
    }) as (...args: A) => void;
  const fail = guarded('onFailure', onFailure) as (response?: R) => void;

  const pollingLoop = async () => {
    while (isPolling && (retriesLeft > 0 || retryForeverEveryMs !== undefined)) {
      try {
        const delay = retriesLeft > 0 ? nextDelay() : (retryForeverEveryMs as number);
        await new Promise((resolve) => setTimeout(resolve, delay));
        if (!isPolling) break;
        if (isAbandoned?.()) {
          isPolling = false;
          break;
        }

        // The fetcher's responsibility is to call onSuccess, onFailure, etc., which in turn call stopPolling.
        await fetcher({
          tx,
          stopPolling,
          onSuccess: guarded('onSuccess', onSuccess),
          onFailure: fail,
          onIntervalTick: guarded('onIntervalTick', onIntervalTick),
          onReplaced: guarded('onReplaced', onReplaced),
        });
        // Only consecutive failures count towards `maxRetries`.
        retriesLeft = maxRetries;
      } catch (error) {
        console.error(`Polling fetcher for txKey ${tx.txKey} threw an error:`, error);
        if (error instanceof FinalPollingError) {
          fail();
          stopPolling();
          return;
        }
        retriesLeft = Math.max(0, retriesLeft - 1);
      }
    }

    if (isPolling && retriesLeft <= 0) {
      console.warn(`Polling for txKey ${tx.txKey} stopped after reaching the maximum number of retries.`);
      fail();
      stopPolling();
    }
  };

  // Start the asynchronous polling loop
  pollingLoop();
}
