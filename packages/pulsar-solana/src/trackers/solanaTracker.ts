/**
 * @file Implements the transaction tracking logic for Solana transactions.
 * It integrates with the Pulsar store and uses a polling mechanism to query the
 * `getSignatureStatuses` RPC method for updates on transaction status.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { createSolanaRPC, getCluster } from '@tuwaio/orbit-solana';
import {
  initializePollingTracker,
  ITxTrackingStore,
  OnSuccessCallback,
  PollingTrackerConfig,
  Transaction,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { Signature, TransactionError } from 'gill';

/**
 * @typedef SolanaSignatureStatusResponse
 * Represents the status of a Solana transaction and includes additional metadata.
 *
 * @property {number} slot - The slot in which the transaction was processed.
 * @property {number | null} confirmations - The number of confirmations received.
 * @property {TransactionError | null} err - The error, if any, associated with the transaction.
 * @property {'processed' | 'confirmed' | 'finalized' | null} confirmationStatus - The status of the transaction's confirmation.
 * @property {number} [fee] - The transaction fee in lamports.
 * @property {string} [recentBlockhash] - The blockhash used for the transaction.
 * @property {unknown[]} [instructions] - The instructions included in the transaction.
 */
type SolanaSignatureStatusResponse = {
  slot: number;
  confirmations: number | null;
  err: TransactionError | null;
  confirmationStatus: 'processed' | 'confirmed' | 'finalized' | null;
  fee?: number;
  recentBlockhash?: string;
  instructions?: unknown[];
};

/**
 * @typedef SolanaFetcherParams
 * Parameters used for the Solana fetcher function.
 */
type SolanaFetcherParams = Parameters<PollingTrackerConfig<SolanaSignatureStatusResponse, Transaction>['fetcher']>[0];

/**
 * Fetches and tracks Solana transactions using the `getSignatureStatuses` RPC method.
 * Transaction details (`getTransaction`) are only fetched once, if not already present in the transaction object.
 *
 * @param {SolanaFetcherParams} params - The fetcher parameters, automatically provided by the tracker.
 * @throws Will throw an error if the transaction adapter is not set to Solana.
 * @returns {Promise<void>} Resolves when the fetcher completes execution for the current polling cycle.
 */
export async function solanaFetcher({
  tx,
  stopPolling,
  onSuccess,
  onFailure,
  onIntervalTick,
}: SolanaFetcherParams): Promise<void> {
  // Validate that the transaction uses the Solana adapter
  if (tx.adapter !== OrbitAdapter.SOLANA) {
    throw new Error('Tx adapter is not Solana. Please set the adapter to "solana" in the transaction object.');
  }

  try {
    // Initialize the Solana RPC client
    const rpc = createSolanaRPC({ rpcUrlOrMoniker: tx.rpcUrl ?? getCluster({ cluster: tx.chainId as string }) });

    // Fetch transaction signature status
    const statuses = await rpc.getSignatureStatuses([tx.txKey as Signature]).send();
    const status = statuses?.value?.[0];

    // Skip further processing if no status is found
    if (!status) {
      return;
    }

    // Extract or fetch transaction details only when missing
    let { fee, recentBlockhash, instructions } = tx;

    if (!fee || !recentBlockhash || !instructions) {
      const txDetails = await rpc
        .getTransaction(tx.txKey as Signature, { encoding: 'json', maxSupportedTransactionVersion: 0 })
        .send();
      const { meta, transaction } = txDetails || {};

      // If no transaction details are found, skip further processing
      if (!meta || !transaction) {
        return;
      }

      // Extract details from RPC response
      fee = Number(meta.fee ?? 0);
      recentBlockhash = transaction.message.recentBlockhash?.toString();
      instructions = transaction.message.instructions as unknown[];
    }

    // Construct the extended transaction status object
    const typedStatus: SolanaSignatureStatusResponse = {
      ...status,
      slot: Number(status.slot),
      confirmations: Number(status.confirmations ?? 0),
      fee,
      recentBlockhash,
      instructions,
    };

    // Trigger periodic updates for transaction tracking
    onIntervalTick?.(typedStatus);

    // Handle transaction error state
    if (typedStatus.err) {
      onFailure(typedStatus);
      stopPolling({ withoutRemoving: true });
      return;
    }

    // Handle finalized transaction state
    if (typedStatus.confirmationStatus === 'finalized') {
      onSuccess(typedStatus);
      stopPolling({ withoutRemoving: true });
      return;
    }

    // Stop polling if the transaction is unconfirmed for more than 1 hour
    const elapsedDays = dayjs().diff(dayjs.unix(tx.localTimestamp), 'hour');
    if (elapsedDays >= 1) {
      onFailure(typedStatus);
      stopPolling();
    }
  } catch (error) {
    console.error('Error in solanaFetcher:', error);
    onFailure({ err: error } as SolanaSignatureStatusResponse);
    stopPolling();
  }
}

/**
 * A higher-level tracker that integrates the Solana polling logic with the Pulsar store.
 *
 * @template T - The application-specific Solana transaction type.
 *
 * @param {object} params - Parameters to connect the Solana tracker with the store.
 * @param {T} params.tx - The Solana transaction being tracked.
 * @param {Function} params.updateTxParams - A callback to update specific fields of a transaction in the store.
 * @param {Function} [params.removeTxFromPool] - A function to remove a completed or canceled transaction from the store.
 * @returns {Promise<void>} Resolves when the tracker is successfully initialized.
 */
export async function solanaTrackerForStore<T extends Transaction>({
  tx,
  onSuccessCallback,
  ...rest
}: Pick<ITxTrackingStore<T>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'> & {
  tx: T;
} & OnSuccessCallback<T>): Promise<void> {
  return initializePollingTracker<SolanaSignatureStatusResponse, T>({
    tx,
    fetcher: solanaFetcher,
    removeTxFromPool: rest.removeTxFromPool,
    pollingInterval: 2500, // Polling interval: 2.5 seconds
    maxRetries: 10, // Max retries: 10 times

    /**
     * Success handler - updates the Pulsar store with finalized transaction details.
     *
     * @param {SolanaSignatureStatusResponse} response - The finalized transaction details.
     */
    onSuccess: (response) => {
      rest.updateTxParams(tx.txKey, {
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
        finishedTimestamp: dayjs().unix(),
        fee: response.fee,
        instructions: response.instructions,
        recentBlockhash: response.recentBlockhash,
        confirmations: 'MAX',
        slot: response.slot,
      });

      // Trigger global success callbacks, if applicable
      const updatedTx = rest.transactionsPool[tx.txKey];
      if (onSuccessCallback && updatedTx) {
        onSuccessCallback(updatedTx);
      }
    },

    /**
     * Interval handler - updates interim transaction details in the store.
     *
     * @param {SolanaSignatureStatusResponse} response - The latest transaction status update.
     */
    onIntervalTick: (response) => {
      rest.updateTxParams(tx.txKey, {
        confirmations: response.confirmations ?? 0,
        slot: response.slot,
        fee: response.fee,
        instructions: response.instructions,
        recentBlockhash: response.recentBlockhash,
      });
    },

    /**
     * Failure handler - updates the store when the transaction fails or times out.
     *
     * @param {SolanaSignatureStatusResponse} response - The failure response details.
     */
    onFailure: (response) => {
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
