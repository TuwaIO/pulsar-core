/**
 * @file This file contains the tracker implementation for standard EVM transactions.
 * It uses viem's public actions (`getTransaction`, `waitForTransactionReceipt`) to monitor
 * a transaction's lifecycle from submission to finality.
 */

import { ITxTrackingStore, Transaction, TransactionStatus } from '@tuwaio/pulsar-core';
import {
  Chain,
  Client,
  GetTransactionReturnType,
  Hex,
  isHex,
  ReplacementReturnType,
  TransactionReceipt,
  WaitForTransactionReceiptParameters,
  zeroHash,
} from 'viem';
import { getBlock, getTransaction, waitForTransactionReceipt } from 'viem/actions';

import { ActionTxKey, TransactionTracker } from '../types';
import { createViemClient } from '../utils/createViemClient';

/**
 * Defines the parameters for the low-level EVM transaction tracker.
 */
export type EVMTrackerParams = {
  /** The transaction object to track, requiring at least `chainId` and `txKey` (the transaction hash). */
  tx: Pick<Transaction<TransactionTracker>, 'chainId' | 'txKey'>;
  /** An array of `viem` chain objects supported by the application. */
  chains: Chain[];
  /** Callback executed when the getTransaction info got successfully. */
  onTxDetailsGot: (localTx: GetTransactionReturnType) => void;
  /** Callback executed when the transaction is successfully mined and included in a block. */
  onFinished: (localTx: GetTransactionReturnType, receipt: TransactionReceipt, client: Client) => Promise<void>;
  /** Callback executed when the transaction is replaced (e.g., sped up or cancelled). */
  onReplaced: (replacement: ReplacementReturnType) => void;
  /** Callback executed if an error occurs during tracking or if the transaction fails. */
  onFailed: (error?: unknown) => void;
  /** Optional callback executed once when the tracker starts. */
  onInitialize?: () => void;
  /** The number of times to retry fetching the transaction if it's not found initially. Defaults to 10. */
  retryCount?: number;
  /** The delay (in milliseconds) between retry attempts. Defaults to 3000ms. */
  retryTimeout?: number;
  /** Optional parameters to pass to viem's `waitForTransactionReceipt` function. */
  waitForTransactionReceiptParams?: WaitForTransactionReceiptParameters;
};

/**
 * A low-level tracker for monitoring a standard EVM transaction by its hash.
 * It retries fetching the transaction and then waits for its receipt.
 *
 * @param {EVMTrackerParams} params - The configuration object for the tracker.
 * @returns {Promise<void>} A promise that resolves when the tracking process is complete (or has terminally failed).
 */
export async function evmTracker({
  onInitialize,
  onTxDetailsGot,
  onFinished,
  onFailed,
  onReplaced,
  tx,
  chains,
  retryCount,
  retryTimeout,
  waitForTransactionReceiptParams,
}: EVMTrackerParams): Promise<void> {
  const maxRetries = retryCount ?? 10;
  const client = createViemClient(tx.chainId as number, chains);

  if (onInitialize) {
    onInitialize();
  }

  if (tx.txKey === zeroHash) {
    throw new Error('Transaction hash is zeroHash');
  }

  if (!client) {
    const error = new Error(`Could not create a viem client for chainId: ${tx.chainId}`);
    onFailed(error);
    console.error(error.message);
    return;
  }

  // Retry loop to handle cases where the transaction is not immediately available on the RPC node.
  for (let i = 0; i < maxRetries; i++) {
    try {
      // 1. Attempt to fetch the transaction details.
      const localTx = await getTransaction(client, { hash: tx.txKey as Hex });

      onTxDetailsGot(localTx);

      let txWasReplaced = false;

      try {
        // 2. Wait for the transaction to be mined.
        const receipt = await waitForTransactionReceipt(client, {
          hash: localTx.hash,
          onReplaced: (replacement: ReplacementReturnType) => {
            txWasReplaced = true;
            onReplaced(replacement);
          },
          pollingInterval: 10_000,
          ...waitForTransactionReceiptParams,
        });

        // If onReplaced was called, the promise resolves but we should not proceed.
        if (txWasReplaced) {
          return;
        }

        // 3. Transaction is mined, call the onFinished callback.
        await onFinished(localTx, receipt, client);
      } catch (e) {
        // Error occurred while waiting for the receipt (e.g., timeout, reverted).
        onFailed(e);
        console.error('Error waiting for transaction receipt:', e);
      }

      // Exit the retry loop once the transaction is found and processed.
      return;
    } catch (e) {
      // Error occurred while fetching the initial transaction details.
      if (i === maxRetries - 1) {
        onFailed(e);
        console.error(`Error tracking EVM transaction after ${maxRetries} retries:`, e);
        return;
      }
    }
    // Wait before the next retry.
    await new Promise((resolve) => setTimeout(resolve, retryTimeout ?? 3000));
  }
}

/**
 * A higher-level wrapper for `evmTracker` that integrates directly with the Zustand store.
 * It provides the necessary callbacks to update the transaction's state in the store.
 *
 * @template T - The application-specific transaction union type.
 */
export async function evmTrackerForStore<T extends Transaction<TransactionTracker>>({
  tx,
  chains,
  transactionsPool,
  updateTxParams,
  onSucceedCallbacks,
}: Pick<EVMTrackerParams, 'chains'> &
  Pick<
    ITxTrackingStore<TransactionTracker, T, ActionTxKey>,
    'transactionsPool' | 'updateTxParams' | 'onSucceedCallbacks'
  > & {
    tx: T;
  }) {
  return await evmTracker({
    tx,
    chains,
    onInitialize: () => {
      updateTxParams({
        txKey: tx.txKey,
        hash: tx.txKey as Hex,
        pending: tx.pending,
      });
    },
    onTxDetailsGot: (localTx) => {
      updateTxParams({
        to: localTx.to ?? '',
        input: localTx.input,
        value: localTx.value || localTx.value === 0n ? String(localTx.value) : undefined,
        txKey: tx.txKey,
        pending: tx.pending,
        nonce: localTx.nonce,
        hash: localTx.hash,
        maxFeePerGas: localTx.maxFeePerGas ? String(localTx.maxFeePerGas) : undefined,
        maxPriorityFeePerGas: localTx.maxPriorityFeePerGas ? String(localTx.maxPriorityFeePerGas) : undefined,
      });
    },
    onFinished: async (localTx, receipt, client) => {
      const txBlock = await getBlock(client, { blockNumber: receipt.blockNumber });
      const timestamp = Number(txBlock.timestamp);
      const isSuccess = receipt.status === 'success';

      updateTxParams({
        txKey: tx.txKey,
        status: isSuccess ? TransactionStatus.Success : TransactionStatus.Failed,
        to: isHex(receipt.to) ? receipt.to : undefined,
        nonce: localTx.nonce,
        pending: false,
        isError: !isSuccess,
        hash: localTx.hash,
        finishedTimestamp: timestamp,
      });

      // After updating the state, retrieve the latest version of the transaction.
      const updatedTX = transactionsPool[tx.txKey];
      if (isSuccess && onSucceedCallbacks && updatedTX) {
        onSucceedCallbacks(updatedTX);
      }
    },
    onReplaced: (replacement) => {
      updateTxParams({
        txKey: tx.txKey,
        status: TransactionStatus.Replaced,
        replacedTxHash: replacement.transaction.hash,
        pending: false,
      });
    },
    onFailed: (error?: unknown) => {
      updateTxParams({
        txKey: tx.txKey,
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Transaction failed or could not be tracked.',
      });
    },
  });
}
