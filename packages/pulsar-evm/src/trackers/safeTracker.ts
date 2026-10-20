/**
 * @file The tracker for Safe multisig transactions. It polls the Safe Transaction Service API for the status of a
 * `safeTxHash`.
 */

import { normalizeError, OrbitAdapter } from '@tuwaio/orbit-core';
import {
  createTxUpdater,
  initializePollingTracker,
  ITxTrackingStore,
  PollingFetcherParams,
  TrackerCallbacks,
  Transaction,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { Hex, zeroHash } from 'viem';

import { SafeTransactionServiceUrls } from '../utils/safeConstants';

// =================================================================================================
// 1. TYPES
// =================================================================================================

/**
 * The fields of a multisig transaction returned by the Safe Transaction Service API that the Safe tracker reads.
 */
export type SafeTxStatusResponse = {
  /** The hash of the executed on-chain transaction, or `null` before execution. */
  transactionHash: Hex | null;
  /** The Safe transaction hash (the `txKey` of the tracked transaction). */
  safeTxHash: Hex;
  /** `true` once the multisig transaction has been executed on-chain. */
  isExecuted: boolean;
  /** Whether the execution succeeded; `null` before execution. */
  isSuccessful: boolean | null;
  /** ISO date of the execution, or `null` before execution. */
  executionDate: string | null;
  /** ISO date when the transaction was proposed to the service. */
  submissionDate: string;
  /** ISO date of the last change. */
  modified: string;
  /** The Safe nonce of the transaction. */
  nonce: number;
  /** The number of owner confirmations the Safe needs to execute the transaction (its threshold). */
  confirmationsRequired?: number;
  /** The owner confirmations collected so far. */
  confirmations?: { owner: string }[] | null;
};

/** How long a Safe transaction may stay unexecuted by default before the tracker gives up: one day. */
export const SAFE_DEFAULT_PENDING_TIMEOUT_MS = 24 * 60 * 60 * 1000;

const HOUR_MS = 60 * 60 * 1000;

/**
 * The polling schedule of the Safe tracker: every 5 s during the first hour of tracking, then every 30 s, since
 * collecting the signatures of several owners can take days.
 *
 * @param elapsedMs - Milliseconds since tracking started.
 * @returns The delay before the next check, in milliseconds.
 */
export const safePollingInterval = (elapsedMs: number): number => (elapsedMs < HOUR_MS ? 5000 : 30000);

/**
 * Describes a duration in whole days, hours or minutes for the error of a stale transaction.
 *
 * @param ms - The duration in milliseconds.
 * @returns For example `a day`, `3 days`, `12 hours` or `30 minutes`.
 */
function describeDuration(ms: number): string {
  const units: [number, string][] = [
    [24 * HOUR_MS, 'day'],
    [HOUR_MS, 'hour'],
    [60 * 1000, 'minute'],
  ];
  for (const [unitMs, unit] of units) {
    if (ms >= unitMs && ms % unitMs === 0) {
      const count = ms / unitMs;
      return count === 1 ? `a ${unit}` : `${count} ${unit}s`;
    }
  }
  return `${Math.round(ms / 1000)} seconds`;
}

/**
 * The options of the Safe tracker.
 */
export type SafeTrackerOptions = {
  /**
   * How long a transaction may stay unexecuted, counted from when it was proposed (`submissionDate`), before the
   * tracker marks it `Failed`. `null` keeps tracking it for as long as the page is open. Defaults to one day
   * ({@link SAFE_DEFAULT_PENDING_TIMEOUT_MS}).
   */
  pendingTimeoutMs?: number | null;
};

/**
 * The response of the Safe Transaction Service when listing the transactions of a nonce.
 */
type SafeTxSameNonceResponse = {
  count: number;
  results: SafeTxStatusResponse[];
};

// =================================================================================================
// 2. FETCHER IMPLEMENTATION
// =================================================================================================

/**
 * Creates a fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that checks a Safe multisig transaction once
 * through the Safe Transaction Service API of `tx.chainId` ({@link SafeTransactionServiceUrls}). `tx.txKey` is the
 * `safeTxHash` and `tx.from` the Safe address.
 *
 * Requests: `GET <service>/multisig-transactions/<safeTxHash>/`, and while it is not executed,
 * `GET <service>/safes/<from>/multisig-transactions/?nonce=<nonce>`.
 *
 * - Executed: calls `onSuccess` or `onFailure` (by `isSuccessful`) and stops polling, keeping the transaction.
 * - Another transaction with the same nonce was executed: calls `onReplaced` with it and stops polling, keeping the
 *   transaction.
 * - Still pending `pendingTimeoutMs` after `submissionDate` (one day by default): calls `onFailure` with the status
 *   and stops polling, keeping the transaction. Without a timeout (`null`) it keeps waiting.
 * - The service returns 404: calls `onFailure()` without a response and stops polling, keeping the transaction.
 * - An unsupported chain or another failed request throws, so the polling tracker counts it as a failed attempt.
 *
 * @param options - The tracker options.
 * @param options.pendingTimeoutMs - How long the transaction may stay unexecuted; `null` waits without a limit.
 * @returns The fetcher. Its promise resolves when the check is done.
 */
export const createSafeFetcher =
  ({ pendingTimeoutMs = SAFE_DEFAULT_PENDING_TIMEOUT_MS }: SafeTrackerOptions = {}) =>
  async ({
    tx,
    stopPolling,
    onSuccess,
    onFailure,
    onReplaced,
    onIntervalTick,
  }: PollingFetcherParams<SafeTxStatusResponse, Pick<Transaction, 'txKey' | 'chainId' | 'from'>>): Promise<void> => {
    const baseUrl = SafeTransactionServiceUrls[tx.chainId as number];
    if (!baseUrl) {
      throw new Error(`Safe Transaction Service URL not found for chainId: ${tx.chainId}`);
    }

    // 1. Fetch the status of the primary transaction.
    const primaryTxResponse = await fetch(`${baseUrl}/multisig-transactions/${tx.txKey}/`);
    if (!primaryTxResponse.ok) {
      // Treat 404 as a terminal failure (the service does not know the transaction).
      if (primaryTxResponse.status === 404) {
        onFailure();
        stopPolling({ withoutRemoving: true });
        return;
      }
      throw new Error(`Safe API responded with status: ${primaryTxResponse.status}`);
    }
    const safeStatus = (await primaryTxResponse.json()) as SafeTxStatusResponse;
    onIntervalTick?.(safeStatus);

    // 2. Check if the primary transaction itself has been executed.
    if (safeStatus.isExecuted) {
      if (safeStatus.isSuccessful) {
        onSuccess(safeStatus);
      } else {
        onFailure(safeStatus);
      }
      stopPolling({ withoutRemoving: true });
      return;
    }

    // 3. If still pending, check for replacements.
    // This is necessary because another transaction with the same nonce might have been executed.
    const nonceTxsResponse = await fetch(
      `${baseUrl}/safes/${tx.from}/multisig-transactions/?nonce=${safeStatus.nonce}`,
    );
    if (!nonceTxsResponse.ok) {
      throw new Error(`Safe API (nonce check) responded with status: ${nonceTxsResponse.status}`);
    }
    const sameNonceTxs = (await nonceTxsResponse.json()) as SafeTxSameNonceResponse;
    const executedTx = sameNonceTxs.results.find((t) => t.isExecuted);

    if (executedTx) {
      // If an executed transaction exists and it's not ours, our transaction was replaced.
      onReplaced?.(executedTx);
      stopPolling({ withoutRemoving: true });
      return;
    }

    // 4. Safeguard: give up on transactions still pending `pendingTimeoutMs` after they were proposed.
    if (pendingTimeoutMs !== null && dayjs().diff(dayjs(safeStatus.submissionDate)) >= pendingTimeoutMs) {
      onFailure(safeStatus);
      stopPolling({ withoutRemoving: true });
    }
  };

/**
 * {@link createSafeFetcher} with the default options: gives up one day after the transaction was proposed.
 */
export const safeFetcher = createSafeFetcher();

// =================================================================================================
// 3. STORE-CONNECTED TRACKER
// =================================================================================================

/**
 * Tracks a Safe multisig transaction of the Pulsar store with {@link createSafeFetcher} ({@link safePollingInterval}:
 * every 5 s for the first hour, then every 30 s; up to 10 consecutive failed attempts) and writes the results to the
 * store: while it waits, the owner confirmations collected (`confirmations`) and the Safe threshold
 * (`requiredConfirmations`) and the executed transaction `hash`; then `Success`, `Failed` or `Replaced` (with the
 * `safeTxHash` of the executed transaction as `replacedTxHash`) and the execution date as `finishedTimestamp`.
 *
 * When tracking gives up (10 consecutive failed attempts, a 404 response, or still pending `pendingTimeoutMs` after it
 * was proposed), the transaction is marked `Failed` with an error that says why, and it stays in the pool.
 *
 * Side effects: sends requests to the Safe Transaction Service. The callbacks receive the transaction with every update
 * written by the tracker.
 *
 * @template T - The application transaction type.
 * @param params - The transaction, the store members and the callbacks.
 * @param params.tx - The transaction to track; `txKey` is the `safeTxHash` and `from` the Safe address.
 * @param params.updateTxParams - The store's `updateTxParams`.
 * @param params.removeTxFromPool - Not used: failed transactions stay in the pool.
 * @param params.transactionsPool - The store's pool when tracking starts.
 * @param params.onSuccess - Called when the transaction was executed successfully.
 * @param params.onError - Called when the execution failed or tracking gave up.
 * @param params.onReplaced - Called when another transaction with the same nonce was executed.
 * @param params.pendingTimeoutMs - How long the transaction may stay unexecuted (see {@link SafeTrackerOptions}).
 */
export function safeTrackerForStore<T extends Transaction>({
  tx,
  updateTxParams,
  transactionsPool,
  onSuccess,
  onError,
  onReplaced,
  pendingTimeoutMs = SAFE_DEFAULT_PENDING_TIMEOUT_MS,
}: Pick<ITxTrackingStore<T>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'> & {
  tx: T;
} & TrackerCallbacks<T> &
  SafeTrackerOptions) {
  const updateTx = createTxUpdater({ tx, transactionsPool, updateTxParams });

  return initializePollingTracker<SafeTxStatusResponse, T>({
    tx,
    fetcher: createSafeFetcher({ pendingTimeoutMs }),
    pollingInterval: safePollingInterval,
    // `removeTxFromPool` is not passed: failed transactions stay in the pool as `Failed`.
    onSuccess: (response) => {
      const updatedTx = updateTx({
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
        hash: response.transactionHash ?? undefined,
        finishedTimestamp: response.executionDate ? dayjs(response.executionDate).unix() : undefined,
      });

      if (onSuccess && updatedTx) {
        onSuccess(updatedTx);
      }
    },
    onIntervalTick: (response) => {
      // Only update fields that might change while pending: the signatures collected so far and the threshold.
      updateTx({
        hash: response.transactionHash ?? undefined,
        confirmations: response.confirmations?.length ?? 0,
        requiredConfirmations: response.confirmationsRequired,
      });
    },
    onFailure: (response) => {
      const err = !response
        ? new Error('Safe transaction not found, or tracking failed.')
        : response.isExecuted
          ? new Error('Safe transaction failed or was rejected.')
          : new Error(
              `Safe transaction was not executed within ${describeDuration(pendingTimeoutMs ?? SAFE_DEFAULT_PENDING_TIMEOUT_MS)}.`,
            );
      const updatedTx = updateTx({
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        hash: response?.transactionHash ?? undefined,
        error: normalizeError(err),
        finishedTimestamp: response?.executionDate ? dayjs(response.executionDate).unix() : undefined,
      });
      if (onError && updatedTx) {
        onError(err, updatedTx);
      }
    },
    onReplaced: (response) => {
      const updatedTx = updateTx({
        status: TransactionStatus.Replaced,
        pending: false,
        hash: tx.adapter === OrbitAdapter.EVM ? tx.hash : zeroHash,
        // The `replacedTxHash` is the `safeTxHash` of the transaction that was executed instead.
        replacedTxHash: response.safeTxHash ?? zeroHash,
        finishedTimestamp: response.executionDate ? dayjs(response.executionDate).unix() : undefined,
      });

      if (onReplaced && updatedTx) {
        onReplaced(updatedTx, tx);
      }
    },
  });
}
