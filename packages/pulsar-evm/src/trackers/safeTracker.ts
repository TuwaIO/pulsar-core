/**
 * @file This file implements the transaction tracking logic for Gnosis Safe (now Safe) multisig transactions.
 * It uses a polling mechanism to query the Safe Transaction Service API for the status of a `safeTxHash`.
 */

import {
  InitializePollingTracker,
  initializePollingTracker,
  ITxTrackingStore,
  Transaction,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { Hex, zeroHash } from 'viem';

import { ActionTxKey, TransactionTracker } from '../types';
import { SafeTransactionServiceUrls } from '../utils/safeConstants';

/**
 * Defines the shape of the transaction object passed to the Safe tracker.
 */
type InitialSafeTx = Pick<Transaction<TransactionTracker>, 'txKey' | 'chainId' | 'from'> & {
  pending?: boolean;
};

/**
 * Defines the shape of the primary response for a single transaction from the Safe Transaction Service API.
 */
export type SafeTxStatusResponse = {
  transactionHash: string;
  safeTxHash: string;
  isExecuted: boolean;
  isSuccessful: boolean | null;
  executionDate: string | null;
  submissionDate: string | null;
  modified: string;
  nonce: number;
  replacedHash?: string; // Custom field for passing replacement info
};

/**
 * Defines the shape of the response when querying for multiple transactions (e.g., by nonce).
 */
type SafeTxSameNonceResponse = {
  count: number;
  results: SafeTxStatusResponse[];
};

/**
 * Defines the parameters for the low-level `safeTracker` function.
 */
export type SafeTrackerParams = Pick<
  InitializePollingTracker<SafeTxStatusResponse, InitialSafeTx, TransactionTracker>,
  | 'tx'
  | 'removeTxFromPool'
  | 'onInitialize'
  | 'onSucceed'
  | 'onFailed'
  | 'onReplaced'
  | 'onIntervalTick'
  | 'pollingInterval'
  | 'retryCount'
>;

/**
 * The fetcher function passed to `initializePollingTracker` to get the status of a Safe transaction.
 * @returns The raw response from the fetch call.
 */
export async function fetchTxFromSafeAPI({
  tx,
  onSucceed,
  onFailed,
  onIntervalTick,
  onReplaced,
  clearWatch,
}: {
  clearWatch: (withoutRemoving?: boolean) => void;
} & Pick<SafeTrackerParams, 'onIntervalTick' | 'onSucceed' | 'onFailed' | 'onReplaced' | 'tx'>): Promise<Response> {
  const primaryTxResponse = await fetch(
    `${SafeTransactionServiceUrls[tx.chainId as number]}/multisig-transactions/${tx.txKey}/`,
  );

  if (!primaryTxResponse.ok) {
    return primaryTxResponse; // Let the polling tracker handle the retry
  }

  const safeStatus = (await primaryTxResponse.json()) as SafeTxStatusResponse;

  // Fetch all other transactions with the same nonce to check for replacements.
  const nonceTxsResponse = await fetch(
    `${SafeTransactionServiceUrls[tx.chainId as number]}/safes/${tx.from}/multisig-transactions/?nonce=${safeStatus.nonce}`,
  );

  if (!nonceTxsResponse.ok) {
    return nonceTxsResponse; // Let the polling tracker handle the retry
  }

  const sameNonceTxs = (await nonceTxsResponse.json()) as SafeTxSameNonceResponse;
  const executedTx = sameNonceTxs.results.find((t) => t.isExecuted);

  // Case 1: Another transaction with the same nonce was executed. This one was replaced.
  if (executedTx && executedTx.safeTxHash !== safeStatus.safeTxHash) {
    onReplaced?.({ ...safeStatus, replacedHash: executedTx.safeTxHash });
    clearWatch(true);
    return nonceTxsResponse;
  }

  // Case 2: The transaction itself was executed.
  if (safeStatus.isExecuted) {
    if (safeStatus.isSuccessful) {
      onSucceed(safeStatus);
    } else {
      onFailed(safeStatus);
    }
    clearWatch(true);
    return primaryTxResponse;
  }

  // Case 3: The transaction is still pending.
  // Safeguard: Stop polling for transactions that have been pending for over a day.
  const modifiedDate = dayjs(safeStatus.modified);
  if (dayjs().diff(modifiedDate, 'day') >= 1) {
    clearWatch(); // Stop polling and remove from pool
    return primaryTxResponse;
  }

  // Otherwise, just report the current status and continue polling.
  onIntervalTick?.(safeStatus);

  return primaryTxResponse;
}

/**
 * A low-level tracker for monitoring Safe multisig transactions.
 * It wraps the generic polling tracker with the Safe-specific fetcher logic.
 */
export async function safeTracker(params: SafeTrackerParams): Promise<void> {
  await initializePollingTracker<SafeTxStatusResponse, InitialSafeTx, TransactionTracker>({
    ...params,
    fetcher: fetchTxFromSafeAPI,
  });
}

/**
 * A higher-level wrapper for `safeTracker` that integrates directly with the Zustand store.
 */
export async function safeTrackerForStore<T extends Transaction<TransactionTracker>>({
  tx,
  transactionsPool,
  updateTxParams,
  onSucceedCallbacks,
  removeTxFromPool,
}: Pick<
  ITxTrackingStore<TransactionTracker, T, ActionTxKey>,
  'transactionsPool' | 'updateTxParams' | 'onSucceedCallbacks' | 'removeTxFromPool'
> & {
  tx: T;
}) {
  return await safeTracker({
    tx,
    removeTxFromPool,
    onSucceed: async (response) => {
      updateTxParams({
        txKey: tx.txKey,
        status: TransactionStatus.Success,
        pending: false,
        hash: response.transactionHash as Hex,
        finishedTimestamp: response.executionDate ? dayjs(response.executionDate).unix() : undefined,
      });

      const updatedTx = transactionsPool[tx.txKey];
      if (onSucceedCallbacks && updatedTx) {
        onSucceedCallbacks(updatedTx);
      }
    },
    onIntervalTick: async (response) => {
      updateTxParams({
        pending: !response.isExecuted,
        txKey: tx.txKey,
        hash: response.transactionHash as Hex,
      });
    },
    onFailed: (response) => {
      updateTxParams({
        txKey: tx.txKey,
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        hash: response.transactionHash as Hex,
        finishedTimestamp: response.executionDate ? dayjs(response.executionDate).unix() : undefined,
      });
    },
    onReplaced: (response) => {
      updateTxParams({
        txKey: tx.txKey,
        status: TransactionStatus.Replaced,
        pending: false,
        hash: response.transactionHash as Hex,
        replacedTxHash: (response.replacedHash ?? zeroHash) as Hex,
        finishedTimestamp: response.executionDate ? dayjs(response.executionDate).unix() : undefined,
      });
    },
  });
}
