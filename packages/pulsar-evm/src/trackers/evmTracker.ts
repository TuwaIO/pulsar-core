/**
 * @file This file contains the tracker implementation for standard EVM transactions.
 * It uses viem's public actions (`getTransaction`, `waitForTransactionReceipt`) to monitor
 * a transaction's lifecycle from submission to finality.
 */

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
import { getBlock, getTransaction, waitForTransactionReceipt } from 'viem/actions';

const DEFAULT_RETRY_COUNT = 10;
const DEFAULT_RETRY_TIMEOUT_MS = 3000;

/**
 * Defines the parameters for the low-level EVM transaction tracker.
 */
export type EVMTrackerParams = {
  tx: Pick<Transaction, 'chainId' | 'txKey'>;
  config: Config;
  onTxDetailsFetched: (txDetails: GetTransactionReturnType) => void;
  onSuccess: (txDetails: GetTransactionReturnType, receipt: TransactionReceipt, client: Client) => Promise<void>;
  onReplaced: (replacement: ReplacementReturnType) => void;
  onFailure: (error?: unknown) => void;
  onInitialize?: () => void;
  retryCount?: number;
  retryTimeout?: number;
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
    waitForTransactionReceiptParams,
  } = params;

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
        console.error(`EVM tracker failed to fetch tx ${tx.txKey} after ${retryCount} retries:`, error);
        return onFailure(error);
      }
      await new Promise((resolve) => setTimeout(resolve, retryTimeout));
    }
  }

  if (!txDetails) {
    return onFailure(new Error('Transaction details could not be fetched.'));
  }

  // 2. Wait for the transaction to be mined and get the receipt.
  try {
    let wasReplaced = false;
    const receipt = await waitForTransactionReceipt(client, {
      hash: txDetails.hash,
      onReplaced: (replacement) => {
        wasReplaced = true;
        onReplaced(replacement);
      },
      ...waitForTransactionReceiptParams,
    });

    if (wasReplaced) {
      return;
    }

    // 3. Transaction is mined, call the onSuccess callback.
    // The callback handles both success and reverted states.
    await onSuccess(txDetails, receipt, client);
  } catch (error) {
    console.error(`Error waiting for receipt for tx ${tx.txKey}:`, error);
    onFailure(error);
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
        errorMessage: error instanceof Error ? error.message : 'Transaction failed or could not be tracked.',
      });

      const updatedTx = transactionsPool[tx.txKey];
      if (onError && updatedTx) {
        onError(error, updatedTx);
      }
    },
  });
}
