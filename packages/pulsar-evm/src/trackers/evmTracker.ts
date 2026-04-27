/**
 * @file This file contains the tracker implementation for standard EVM transactions.
 * It uses viem's public actions (`getTransaction`, `waitForTransactionReceipt`) to monitor
 * a transaction's lifecycle from submission to finality.
 */

import { normalizeError } from '@tuwaio/orbit-core';
import { ITxTrackingStore, TrackerCallbacks, Transaction, TransactionStatus } from '@tuwaio/pulsar-core';
import { Config, getClient } from '@wagmi/core';
import {
  Client,
  GetTransactionReturnType,
  Hex,
  ReplacementReturnType,
  TransactionReceipt,
  WaitForTransactionReceiptParameters,
  zeroHash,
} from 'viem';
import { getBlock, getTransaction, getTransactionConfirmations, waitForTransactionReceipt } from 'viem/actions';

const DEFAULT_RETRY_COUNT = 10;
const DEFAULT_RETRY_TIMEOUT_MS = 3000;
const RECEIPT_MAX_RETRIES = 3;
const RECEIPT_RETRY_DELAY = 10_000; // 10s between outer retries
const CONFIRMATIONS_POLLING_INTERVAL = 5000; // 5s between confirmation checks

/**
 * Defines the parameters for the low-level EVM transaction tracker.
 */
export type EVMTrackerParams = {
  tx: Pick<Transaction, 'chainId' | 'txKey' | 'requiredConfirmations'>;
  config: Config;
  onTxDetailsFetched: (txDetails: GetTransactionReturnType) => void;
  onSuccess: (txDetails: GetTransactionReturnType, receipt: TransactionReceipt, client: Client) => Promise<void>;
  onReplaced: (replacement: ReplacementReturnType) => void;
  onFailure: (error?: unknown) => void;
  onInitialize?: () => void;
  retryCount?: number;
  retryTimeout?: number;
  onConfirmationsUpdate?: (confirmations: number) => void;
  waitForTransactionReceiptParams?: WaitForTransactionReceiptParameters;
};

/**
 * A low-level tracker for monitoring a standard EVM transaction by its hash.
 * It retries fetching the transaction and then waits for its receipt to determine the final status.
 *
 * @param {EVMTrackerParams} params - The configuration object for the tracker.
 */
export async function evmTracker(params: EVMTrackerParams): Promise<void> {
  const {
    tx,
    config,
    onInitialize,
    onTxDetailsFetched,
    onSuccess,
    onFailure,
    onReplaced,
    retryCount = DEFAULT_RETRY_COUNT,
    retryTimeout = DEFAULT_RETRY_TIMEOUT_MS,
    onConfirmationsUpdate,
    waitForTransactionReceiptParams,
  } = params;
  const { requiredConfirmations } = tx;

  onInitialize?.();

  if (tx.txKey === zeroHash) {
    return onFailure(new Error('Transaction hash cannot be the zero hash.'));
  }

  const client = getClient(config, { chainId: tx.chainId as number });
  if (!client) {
    return onFailure(new Error(`Could not create a viem client for chainId: ${tx.chainId}`));
  }

  let txDetails: GetTransactionReturnType | null = null;

  // 1. Retry loop to fetch the transaction details.
  for (let i = 0; i < retryCount; i++) {
    try {
      txDetails = await getTransaction(client, { hash: tx.txKey as Hex });
      onTxDetailsFetched(txDetails);
      break;
    } catch (error) {
      if (i === retryCount - 1) {
        console.error(`[evmTracker] Fatal error fetching transaction ${tx.txKey} on chain ${tx.chainId}:`, error);
        return onFailure(error);
      }
      console.warn(
        `[evmTracker] Error fetching transaction ${tx.txKey} on chain ${tx.chainId} (attempt ${i + 1}/${retryCount}):`,
        error,
      );
      await new Promise((resolve) => setTimeout(resolve, retryTimeout));
    }
  }

  if (!txDetails) {
    return onFailure(new Error('Transaction details could not be fetched.'));
  }

  // 2. Wait for the transaction to be mined and get the receipt.
  let wasReplaced = false;
  for (let attempt = 0; attempt <= RECEIPT_MAX_RETRIES; attempt++) {
    try {
      const receipt = await waitForTransactionReceipt(client, {
        hash: txDetails.hash,
        onReplaced: (replacement) => {
          wasReplaced = true;
          onReplaced(replacement);
        },
        ...waitForTransactionReceiptParams,
      });
      if (!wasReplaced) {
        // 3. Wait for required confirmations if specified.
        const needed = requiredConfirmations ?? 1;
        if (needed > 1) {
          while (true) {
            try {
              const confirmations = await getTransactionConfirmations(client, {
                transactionReceipt: receipt,
              });
              const current = Number(confirmations);
              onConfirmationsUpdate?.(current);

              if (current >= needed) break;
            } catch (error) {
              // Non-blocking error, just log and retry.
              console.warn(`[evmTracker] Error fetching confirmations for ${tx.txKey} on chain ${tx.chainId}:`, error);
            }
            await new Promise((resolve) => setTimeout(resolve, CONFIRMATIONS_POLLING_INTERVAL));
          }
        }
        await onSuccess(txDetails, receipt, client);
      }
      return;
    } catch (error) {
      const isTransient = error instanceof Error && error.name === 'TransactionReceiptNotFoundError';
      if (isTransient && !wasReplaced && attempt < RECEIPT_MAX_RETRIES) {
        console.warn(`[evmTracker] Receipt not found for ${tx.txKey}, retry ${attempt + 1}/${RECEIPT_MAX_RETRIES}...`);
        await new Promise((r) => setTimeout(r, RECEIPT_RETRY_DELAY * (attempt + 1)));
        continue;
      }
      onFailure(error);
      return;
    }
  }
}

/**
 * A higher-level wrapper for `evmTracker` that integrates directly with the Pulsar store.
 * It provides the necessary callbacks to update a transaction's state throughout its lifecycle.
 *
 * @template T - The application-specific transaction type.
 */
export async function evmTrackerForStore<T extends Transaction>(
  params: Pick<EVMTrackerParams, 'config'> &
    Pick<ITxTrackingStore<T>, 'updateTxParams' | 'transactionsPool'> & {
      tx: T;
    } & TrackerCallbacks<T>,
) {
  const { tx, config, updateTxParams, transactionsPool, onSuccess, onError, onReplaced } = params;

  return evmTracker({
    tx,
    config,
    onInitialize: () => {
      updateTxParams(tx.txKey, { hash: tx.txKey as Hex });
    },
    onTxDetailsFetched: (txDetails) => {
      updateTxParams(tx.txKey, {
        to: txDetails.to ?? undefined,
        input: txDetails.input,
        value: txDetails.value?.toString(),
        nonce: txDetails.nonce,
        maxFeePerGas: txDetails.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: txDetails.maxPriorityFeePerGas?.toString(),
      });
    },
    onConfirmationsUpdate: (confirmations) => {
      updateTxParams(tx.txKey, { confirmations });
    },
    onSuccess: async (txDetails, receipt, client) => {
      const block = await getBlock(client, { blockNumber: receipt.blockNumber });
      const timestamp = Number(block.timestamp);
      const isSuccess = receipt.status === 'success';

      updateTxParams(tx.txKey, {
        status: isSuccess ? TransactionStatus.Success : TransactionStatus.Failed,
        isError: !isSuccess,
        pending: false,
        finishedTimestamp: timestamp,
      });

      // After the final state update, retrieve the latest version of the transaction
      // and trigger the global success callback if applicable.
      const updatedTx = transactionsPool[tx.txKey];
      if (isSuccess && onSuccess && updatedTx) {
        onSuccess(updatedTx);
      }
      // Call onError for reverted transactions
      if (!isSuccess && onError && updatedTx) {
        onError(new Error('Transaction reverted'), updatedTx);
      }
    },
    onReplaced: (replacement) => {
      updateTxParams(tx.txKey, {
        status: TransactionStatus.Replaced,
        replacedTxHash: replacement.transaction.hash,
        pending: false,
      });

      const updatedTx = transactionsPool[tx.txKey];
      if (onReplaced && updatedTx) {
        onReplaced(updatedTx, tx);
      }
    },
    onFailure: (error) => {
      updateTxParams(tx.txKey, {
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        error: normalizeError(error),
      });

      const updatedTx = transactionsPool[tx.txKey];
      if (onError && updatedTx) {
        onError(error, updatedTx);
      }
    },
  });
}
