/**
 * @file This file implements the transaction tracking logic for Safe (formerly Gnosis Safe) multisig transactions.
 * It uses a polling mechanism to query the Safe Transaction Service API for the status of a `safeTxHash`.
 */

import {
  initializePollingTracker,
  ITxTrackingStore,
  PollingTrackerConfig,
  Transaction,
  TransactionAdapter,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { Hex, zeroHash } from 'viem';

import { ActionTxKey, TransactionTracker } from '../types';
import { SafeTransactionServiceUrls } from '../utils/safeConstants';

// =================================================================================================
// 1. TYPES
// =================================================================================================

/**
 * Defines the shape of the primary response for a single transaction from the Safe Transaction Service API.
 */
export type SafeTxStatusResponse = {
  transactionHash: Hex | null;
  safeTxHash: Hex;
  isExecuted: boolean;
  isSuccessful: boolean | null;
  executionDate: string | null;
  submissionDate: string;
  modified: string;
  nonce: number;
};

/**
 * The response shape when querying for multiple transactions (e.g., by nonce).
 */
type SafeTxSameNonceResponse = {
  count: number;
  results: SafeTxStatusResponse[];
};

// =================================================================================================
// 2. FETCHER IMPLEMENTATION
// =================================================================================================

/**
 * A reusable fetcher for `initializePollingTracker` that queries the Safe Transaction Service API.
 * It handles the complex logic of detecting executed, failed, and replaced multisig transactions.
 */
export const safeFetcher: PollingTrackerConfig<
  SafeTxStatusResponse,
  Transaction<TransactionTracker>,
  TransactionTracker
>['fetcher'] = async ({ tx, stopPolling, onSuccess, onFailure, onReplaced, onIntervalTick }) => {
  const baseUrl = SafeTransactionServiceUrls[tx.chainId as number];
  if (!baseUrl) {
    throw new Error(`Safe Transaction Service URL not found for chainId: ${tx.chainId}`);
  }

  // 1. Fetch the status of the primary transaction.
  const primaryTxResponse = await fetch(`${baseUrl}/multisig-transactions/${tx.txKey}/`);
  if (!primaryTxResponse.ok) {
    // Treat 404 as a terminal failure (transaction is lost).
    if (primaryTxResponse.status === 404) {
      onFailure();
      stopPolling();
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

  // 4. Safeguard: Stop polling for very old pending transactions.
  if (dayjs().diff(dayjs(safeStatus.submissionDate), 'day') >= 1) {
    stopPolling();
  }
};

// =================================================================================================
// 3. STORE-CONNECTED TRACKER
// =================================================================================================

/**
 * A higher-level wrapper that integrates the Safe polling logic with the Pulsar store.
 * It uses the generic `safeFetcher` and provides store-specific callbacks.
 *
 * @template T - The application-specific transaction type.
 */
export function safeTrackerForStore<T extends Transaction<TransactionTracker>>({
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
  return initializePollingTracker<SafeTxStatusResponse, T, TransactionTracker>({
    tx,
    fetcher: safeFetcher,
    removeTxFromPool,
    onSuccess: (response) => {
      updateTxParams(tx.txKey, {
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
        hash: response.transactionHash ?? undefined,
        finishedTimestamp: response.executionDate ? dayjs(response.executionDate).unix() : undefined,
      });

      const updatedTx = transactionsPool[tx.txKey];
      if (onSucceedCallbacks && updatedTx) {
        onSucceedCallbacks(updatedTx);
      }
    },
    onIntervalTick: (response) => {
      // Only update fields that might change while pending.
      updateTxParams(tx.txKey, {
        hash: response.transactionHash ?? undefined,
      });
    },
    onFailure: (response) => {
      updateTxParams(tx.txKey, {
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        hash: response?.transactionHash ?? undefined,
        errorMessage: response ? 'Safe transaction failed or was rejected.' : 'Transaction not found.',
        finishedTimestamp: response?.executionDate ? dayjs(response.executionDate).unix() : undefined,
      });
    },
    onReplaced: (response) => {
      updateTxParams(tx.txKey, {
        status: TransactionStatus.Replaced,
        pending: false,
        hash: tx.adapter === TransactionAdapter.EVM ? tx.hash : zeroHash,
        // The `replacedTxHash` is the `safeTxHash` of the transaction that was executed instead.
        replacedTxHash: response.safeTxHash ?? zeroHash,
        finishedTimestamp: response.executionDate ? dayjs(response.executionDate).unix() : undefined,
      });
    },
  });
}
