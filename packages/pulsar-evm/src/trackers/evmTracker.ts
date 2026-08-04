/**
 * @file This file contains the tracker implementation for standard EVM transactions.
 * It uses viem's public actions (`getTransaction`, `waitForTransactionReceipt`) to monitor
 * a transaction's lifecycle from submission to finality with robust timeout handling.
 */

import { normalizeError } from '@tuwaio/orbit-core';
import { ITxTrackingStore, TrackerCallbacks, Transaction, TransactionStatus } from '@tuwaio/pulsar-core';
import { Config, getClient } from '@wagmi/core';
import {
  Client,
  GetTransactionReturnType,
  Hex,
  HttpRequestError,
  ReplacementReturnType,
  TransactionReceipt,
  TransactionReceiptNotFoundError,
  WaitForTransactionReceiptParameters,
  WaitForTransactionReceiptTimeoutError,
  WebSocketRequestError,
  zeroHash,
} from 'viem';
import { getBlock, getTransaction, getTransactionConfirmations, waitForTransactionReceipt } from 'viem/actions';

const DEFAULT_RETRY_COUNT = 10;
const DEFAULT_RETRY_TIMEOUT_MS = 3000;
const RECEIPT_MAX_RETRIES = 5;
const RECEIPT_RETRY_DELAY = 5_000; // 5s base delay for outer retries
const CONFIRMATIONS_POLLING_INTERVAL = 5000; // 5s between confirmation checks
const SINGLE_ATTEMPT_TIMEOUT = 60_000; // 60s timeout per single RPC call

/**
 * Checks whether an error during receipt polling is transient (RPC network glitch, timeout, or unindexed tx).
 * Recursively inspects nested error causes to handle wrapped Viem transport errors.
 *
 * @param error - The caught error object.
 * @returns `true` if the error is considered transient and retryable; otherwise `false`.
 */
export function isRetryableReceiptError(error: unknown): boolean {
  if (!error) return false;

  const checkSingleError = (err: unknown): boolean => {
    if (!(err instanceof Error)) return false;

    // Viem explicit receipt errors
    if (
      err instanceof WaitForTransactionReceiptTimeoutError ||
      err instanceof TransactionReceiptNotFoundError ||
      err.name === 'WaitForTransactionReceiptTimeoutError' ||
      err.name === 'TransactionReceiptNotFoundError'
    ) {
      return true;
    }

    // Network and transport-level glitches (Alchemy/Infura rate limits, 502/503, connection drops)
    if (
      err instanceof HttpRequestError ||
      err instanceof WebSocketRequestError ||
      err.name === 'HttpRequestError' ||
      err.name === 'WebSocketRequestError' ||
      err.name === 'TimeoutError'
    ) {
      return true;
    }

    const msg = err.message.toLowerCase();
    return (
      msg.includes('fetch failed') ||
      msg.includes('network error') ||
      msg.includes('timeout') ||
      msg.includes('timed out') ||
      msg.includes('econnreset') ||
      msg.includes('rate limit') ||
      msg.includes('502') ||
      msg.includes('503') ||
      msg.includes('504')
    );
  };

  if (checkSingleError(error)) return true;

  // Inspect nested cause for wrapped Viem BaseErrors
  if (error instanceof Error && 'cause' in error && error.cause) {
    return isRetryableReceiptError(error.cause);
  }

  return false;
}

/**
 * Defines the parameters for the low-level EVM transaction tracker.
 */
export type EVMTrackerParams = {
  /** The transaction identity parameters (chainId, txKey, requiredConfirmations). */
  tx: Pick<Transaction, 'chainId' | 'txKey' | 'requiredConfirmations'>;
  /** The `@wagmi/core` configuration instance used to resolve network clients. */
  config: Config;
  /** Callback fired once transaction details (nonce, input, values) are successfully fetched. */
  onTxDetailsFetched: (txDetails: GetTransactionReturnType) => void;
  /** Callback fired when the transaction is mined successfully (or reverted on-chain). */
  onSuccess: (txDetails: GetTransactionReturnType, receipt: TransactionReceipt, client: Client) => Promise<void>;
  /** Callback fired when the transaction has been replaced (repriced or cancelled). */
  onReplaced: (replacement: ReplacementReturnType) => void;
  /** Callback fired when tracking fails fatally or exceeds all retry attempts. */
  onFailure: (error?: unknown) => void;
  /** Optional callback fired when tracker initialization starts. */
  onInitialize?: () => void;
  /** Number of retries for the initial `getTransaction` fetch step. Defaults to 10. */
  retryCount?: number;
  /** Timeout in milliseconds between `getTransaction` retry attempts. Defaults to 3000ms. */
  retryTimeout?: number;
  /** Optional callback fired whenever required block confirmation count updates. */
  onConfirmationsUpdate?: (confirmations: number) => void;
  /** Optional custom parameters passed directly to viem's `waitForTransactionReceipt`. */
  waitForTransactionReceiptParams?: WaitForTransactionReceiptParameters;
};

/**
 * A low-level tracker for monitoring a standard EVM transaction by its hash.
 * Retries fetching transaction details and gracefully polls for transaction receipt,
 * recovering automatically from RPC network glitches and timeout errors.
 *
 * @param params - The configuration parameters and lifecycle callbacks for the EVM tracker.
 * @returns A promise that resolves when tracking completes or fails fatally.
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
        retryCount: DEFAULT_RETRY_COUNT,
        retryDelay: DEFAULT_RETRY_TIMEOUT_MS,
        timeout: SINGLE_ATTEMPT_TIMEOUT,
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
              console.warn(`[evmTracker] Error fetching confirmations for ${tx.txKey} on chain ${tx.chainId}:`, error);
            }
            await new Promise((resolve) => setTimeout(resolve, CONFIRMATIONS_POLLING_INTERVAL));
          }
        }
        await onSuccess(txDetails, receipt, client);
      }
      return;
    } catch (error) {
      const isRetryable = isRetryableReceiptError(error);

      if (isRetryable && !wasReplaced && attempt < RECEIPT_MAX_RETRIES) {
        console.warn(
          `[evmTracker] Transient error for ${tx.txKey} on chain ${tx.chainId} (attempt ${attempt + 1}/${RECEIPT_MAX_RETRIES}). Error: ${
            error instanceof Error ? error.name : 'Unknown'
          }. Retrying...`,
        );
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
 * Updates transaction lifecycle states (pending, success, failed, replaced) in the Zustand store.
 *
 * @template T - The application-specific transaction state structure extending `Transaction`.
 * @param params - Configuration connecting `@wagmi/core`, store mutation methods, target transaction, and callbacks.
 * @returns A promise that resolves when transaction tracking finishes and store state is committed.
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

      const updatedTx = transactionsPool[tx.txKey];
      if (isSuccess && onSuccess && updatedTx) {
        onSuccess(updatedTx);
      }
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
