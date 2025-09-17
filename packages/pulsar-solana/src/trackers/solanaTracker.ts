/**
 * @file Implements the transaction tracking logic for standard Solana transactions.
 * It uses a polling mechanism to query the `getSignatureStatuses` RPC method
 * and updates the transaction's state in the Pulsar store.
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
import { Signature, TransactionError } from 'gill';

import { SolanaActionTxKey, SolanaTransactionTracker } from '../types';
import { createSolanaRPC } from '../utils/createSolanaRPC';

// --- Types ---

/**
 * The structure of the status object returned by the Solana RPC `getSignatureStatuses` method.
 * It represents the real-time status of a Solana transaction.
 * Note: `slot and confirmations` is received as a `bigint` but converted to `number` before being processed.
 * @internal
 */
type SolanaSignatureStatusResponse = {
  slot: number;
  confirmations: number | null;
  err: TransactionError | null;
  confirmationStatus: 'processed' | 'confirmed' | 'finalized' | null;
};

/**
 * The function parameters for the `solanaFetcher` function.
 * These are automatically derived from the generic `PollingTrackerConfig` fetcher function.
 * @internal
 */
type SolanaFetcherParams = Parameters<
  PollingTrackerConfig<
    SolanaSignatureStatusResponse,
    Transaction<SolanaTransactionTracker>,
    SolanaTransactionTracker
  >['fetcher']
>[0];

// --- Fetcher Implementation ---

/**
 * The core polling fetcher function for Solana transactions.
 *
 * This function queries the Solana RPC for updates on a transaction's status.
 * It processes the response and triggers appropriate callbacks (`onSuccess`, `onFailure`, etc.)
 * based on the transaction's state.
 *
 * @param {SolanaFetcherParams} params - The parameters for the fetcher, including the transaction object
 * and various callbacks for handling updates.
 * @returns {Promise<void>} A promise that resolves once the fetcher function completes.
 */
export async function solanaFetcher({
  tx,
  stopPolling,
  onSuccess,
  onFailure,
  onIntervalTick,
}: SolanaFetcherParams): Promise<void> {
  if (tx.adapter !== TransactionAdapter.SOLANA) {
    throw new Error('Tx adapter is not Solana. Please set adapter to "solana" in the transaction object.');
  }

  // Fetch the transaction status from the Solana RPC.
  const rpc = createSolanaRPC(tx.rpcUrl ?? (tx.chainId as string));
  const statuses = await rpc.getSignatureStatuses([tx.txKey as Signature]).send();
  const status = statuses?.value[0];

  if (!status) {
    // Skip processing if the transaction is not yet found by the RPC node.
    return;
  }

  // Convert `slot` and `confirmations` to a number and process the response.
  const typedStatus: SolanaSignatureStatusResponse = {
    ...status,
    slot: Number(status.slot),
    confirmations: Number(status.confirmations ?? 0),
  };

  // Trigger onIntervalTick for intermediate updates.
  onIntervalTick?.(typedStatus);

  if (typedStatus.err) {
    // Handle a terminal error state if an error exists in the response.
    onFailure(typedStatus);
    stopPolling(); // Stop polling after the error has been processed.
    return;
  }

  if (typedStatus.confirmationStatus === 'finalized') {
    // Handle a terminal success state when the transaction is finalized.
    onSuccess(typedStatus);
    stopPolling(); // Stop polling after the success has been processed.
    return;
  }

  // Safeguard: Stop polling for transactions pending longer than 30 minutes.
  const elapsedMinutes = dayjs().diff(dayjs.unix(tx.localTimestamp), 'minute');
  if (elapsedMinutes >= 30) {
    stopPolling({ withoutRemoving: true });
    onFailure(typedStatus);
  }
}

// --- Store-Connected Tracker ---

/**
 * A higher-level polling tracker that integrates the Solana transaction tracking logic
 * with the Pulsar store's transaction management.
 *
 * This function initializes and manages the lifecycle of polling for a Solana transaction's status.
 * It dynamically updates the transaction state in the store based on polling results.
 *
 * @template T - The application-specific type for the transaction, extending `Transaction`.
 * @param {object} params - The parameters for the store-connected tracker.
 * @param {T} params.tx - The Solana transaction object to be tracked.
 * @param {Record<string, T>} params.transactionsPool - The current pool of transactions in the store.
 * @param {Function} params.updateTxParams - A function to update specific fields of a transaction in the store.
 * @param {Function} [params.onSucceedCallbacks] - Optional callbacks to trigger on a successful tracking outcome.
 * @param {Function} [params.removeTxFromPool] - A function to remove the tracked transaction from the pool.
 * @returns {Promise<void>} A promise that resolves once the tracking process is initialized.
 */
export async function solanaTrackerForStore<T extends Transaction<SolanaTransactionTracker>>({
  tx,
  ...rest
}: Pick<
  ITxTrackingStore<SolanaTransactionTracker, T, SolanaActionTxKey>,
  'transactionsPool' | 'updateTxParams' | 'onSucceedCallbacks' | 'removeTxFromPool'
> & {
  tx: T;
}): Promise<void> {
  return initializePollingTracker<SolanaSignatureStatusResponse, T, SolanaTransactionTracker>({
    tx,
    fetcher: solanaFetcher,
    removeTxFromPool: rest.removeTxFromPool,
    pollingInterval: 2500, // Poll every 2.5 seconds.
    maxRetries: 10, // Limit retries to 10 attempts.

    onSuccess: (response) => {
      // Update the store on a successful transaction outcome.
      rest.updateTxParams(tx.txKey, {
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
        finishedTimestamp: dayjs().unix(),
        confirmations: response.confirmations ?? 1,
        slot: response.slot,
      });

      // Trigger global success callbacks if provided.
      const updatedTx = rest.transactionsPool[tx.txKey];
      if (rest.onSucceedCallbacks && updatedTx) {
        rest.onSucceedCallbacks(updatedTx);
      }
    },

    onIntervalTick: (response) => {
      // Update fields at each polling interval (e.g., confirmations and slot).
      rest.updateTxParams(tx.txKey, {
        confirmations: response.confirmations ?? 0,
        slot: response.slot,
      });
    },

    onFailure: (response) => {
      // Handle a failure state for the transaction.
      const errorMessage = response?.err
        ? `Transaction failed: ${JSON.stringify(response.err)}`
        : 'Transaction tracking timed out or the transaction was not found.';
      rest.updateTxParams(tx.txKey, {
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        errorMessage,
        finishedTimestamp: dayjs().unix(),
      });
    },
  });
}
