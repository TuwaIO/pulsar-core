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
 * A fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that checks a Safe multisig transaction once
 * through the Safe Transaction Service API of `tx.chainId` ({@link SafeTransactionServiceUrls}). `tx.txKey` is the
 * `safeTxHash` and `tx.from` the Safe address.
 *
 * Requests: `GET <service>/multisig-transactions/<safeTxHash>/`, and while it is not executed,
 * `GET <service>/safes/<from>/multisig-transactions/?nonce=<nonce>`.
 *
 * - Executed: calls `onSuccess` or `onFailure` (by `isSuccessful`) and stops polling, keeping the transaction.
 * - Another transaction with the same nonce was executed: calls `onReplaced` with it and stops polling, keeping the
 *   transaction.
 * - Still pending one day after `submissionDate`: calls `onFailure` with the status and stops polling, keeping the
 *   transaction.
 * - The service returns 404: calls `onFailure()` without a response and stops polling, keeping the transaction.
 * - An unsupported chain or another failed request throws, so the polling tracker counts it as a failed attempt.
 *
 * @param params - The fetcher parameters provided by `initializePollingTracker`.
 * @returns A promise that resolves when the check is done.
 */
export const safeFetcher = async ({
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
  const nonceTxsResponse = await fetch(`${baseUrl}/safes/${tx.from}/multisig-transactions/?nonce=${safeStatus.nonce}`);
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

  // 4. Safeguard: give up on transactions still pending one day after they were proposed.
  if (dayjs().diff(dayjs(safeStatus.submissionDate), 'day') >= 1) {
    onFailure(safeStatus);
    stopPolling({ withoutRemoving: true });
  }
};

// =================================================================================================
// 3. STORE-CONNECTED TRACKER
// =================================================================================================

/**
 * Tracks a Safe multisig transaction of the Pulsar store with {@link safeFetcher} (every 5 s, up to 10 consecutive
 * failed attempts) and writes the results to the store: the executed transaction `hash`, then `Success`, `Failed` or
 * `Replaced` (with the `safeTxHash` of the executed transaction as `replacedTxHash`) and the execution date as
 * `finishedTimestamp`.
 *
 * When tracking gives up (10 consecutive failed attempts, a 404 response, or still pending one day after it was
 * proposed), the transaction is marked `Failed` with an error that says why, and it stays in the pool.
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
 */
export function safeTrackerForStore<T extends Transaction>({
  tx,
  updateTxParams,
  transactionsPool,
  onSuccess,
  onError,
  onReplaced,
}: Pick<ITxTrackingStore<T>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'> & {
  tx: T;
} & TrackerCallbacks<T>) {
  const updateTx = createTxUpdater({ tx, transactionsPool, updateTxParams });

  return initializePollingTracker<SafeTxStatusResponse, T>({
    tx,
    fetcher: safeFetcher,
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
      // Only update fields that might change while pending.
      updateTx({
        hash: response.transactionHash ?? undefined,
      });
    },
    onFailure: (response) => {
      const err = !response
        ? new Error('Safe transaction not found, or tracking failed.')
        : response.isExecuted
          ? new Error('Safe transaction failed or was rejected.')
          : new Error('Safe transaction was not executed within a day.');
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
