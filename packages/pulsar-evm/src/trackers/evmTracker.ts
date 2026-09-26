/**
 * @file The tracker for standard EVM transactions. It uses viem actions (`getTransaction`,
 * `waitForTransactionReceipt`, `getTransactionConfirmations`, `getBlock`) through the wagmi client of the chain.
 */

import { normalizeError } from '@tuwaio/orbit-core';
import {
  createTxUpdater,
  ITxTrackingStore,
  TrackerCallbacks,
  Transaction,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
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
 * Checks whether an error thrown while waiting for a receipt is transient: a receipt timeout or "not found" error, an
 * HTTP or WebSocket transport error, or a message about a timeout, rate limit, connection reset or a 502/503/504
 * status. Nested `cause` errors are checked too.
 *
 * @param error - The caught error.
 * @returns `true` if waiting for the receipt should be retried.
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
 * The configuration of {@link evmTracker}.
 */
export type EVMTrackerParams = {
  /**
   * The transaction: its hash (`txKey`), its numeric `chainId` (which must be configured in `config`) and, optionally,
   * the number of confirmations to wait for.
   */
  tx: Pick<Transaction, 'chainId' | 'txKey' | 'requiredConfirmations'>;
  /** The wagmi config; the tracker uses its client for `tx.chainId`. */
  config: Config;
  /**
   * Called once with the result of `getTransaction`.
   * @param txDetails - The transaction: nonce, fees, `to`, `value`, `input`.
   */
  onTxDetailsFetched: (txDetails: GetTransactionReturnType) => void;
  /**
   * Called and awaited once the receipt is available and the required confirmations are reached. Also called for
   * reverted transactions: check `receipt.status`.
   * @param txDetails - The result of `getTransaction`.
   * @param receipt - The transaction receipt.
   * @param client - The viem client of the chain, for further RPC calls.
   */
  onSuccess: (txDetails: GetTransactionReturnType, receipt: TransactionReceipt, client: Client) => Promise<void>;
  /**
   * Called when viem detects that another transaction with the same nonce replaced this one (speed-up or cancel).
   * @param replacement - viem's replacement data: the `reason` and the replacing `transaction`.
   */
  onReplaced: (replacement: ReplacementReturnType) => void;
  /**
   * Called once when tracking gives up (see {@link evmTracker}).
   * @param error - The last error.
   */
  onFailure: (error?: unknown) => void;
  /** Called once, before anything else. */
  onInitialize?: () => void;
  /** Number of `getTransaction` attempts. Defaults to 10. */
  retryCount?: number;
  /** Delay between `getTransaction` attempts, in milliseconds. Defaults to 3000. */
  retryTimeout?: number;
  /**
   * Called while waiting for `requiredConfirmations` (only when it is above 1).
   * @param confirmations - The current number of confirmations.
   */
  onConfirmationsUpdate?: (confirmations: number) => void;
  /**
   * Options for viem's `waitForTransactionReceipt`, merged over the defaults (`retryCount: 10`, `retryDelay: 3000`,
   * `timeout: 60000`).
   */
  waitForTransactionReceiptParams?: WaitForTransactionReceiptParameters;
};

/**
 * Tracks a standard EVM transaction by its hash, without a store. Use it to track transactions in your own state or on
 * a server.
 *
 * Steps (all RPC calls go through the wagmi client of `tx.chainId`):
 * 1. Calls `onInitialize`. Fails at once for the zero hash or when there is no client for the chain.
 * 2. Calls `getTransaction` up to `retryCount` times, `retryTimeout` ms apart, so a transaction the node has not
 *    indexed yet is still found; then calls `onTxDetailsFetched`.
 * 3. Waits for the receipt with `waitForTransactionReceipt`, retrying up to 5 times (5, 10, 15, 20 and 25 s apart) when
 *    {@link isRetryableReceiptError} matches. If viem reports a replacement, calls `onReplaced` and stops.
 * 4. If `requiredConfirmations` is above 1, polls `getTransactionConfirmations` every 5 s until it is reached.
 * 5. Awaits `onSuccess`, also for reverted transactions.
 *
 * Any other error, including one thrown by `onSuccess`, is passed to `onFailure`.
 *
 * @param params - The transaction, the wagmi config and the callbacks.
 * @returns A promise that resolves when tracking has finished.
 *
 * @example
 * ```ts
 * await evmTracker({
 *   config: wagmiConfig,
 *   tx: { txKey: hash, chainId: 1, requiredConfirmations: 2 },
 *   onTxDetailsFetched: (details) => console.log('Nonce', details.nonce),
 *   onSuccess: async (_details, receipt) => console.log('Mined with status', receipt.status),
 *   onReplaced: (replacement) => console.log('Replaced by', replacement.transaction.hash),
 *   onFailure: (error) => console.error('Tracking failed', error),
 * });
 * ```
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
 * Runs {@link evmTracker} for a transaction of the Pulsar store and writes the results to it through
 * `updateTxParams`: `hash` at start, the transaction details, `confirmations`, and finally `status` `Success`/`Failed`
 * with `pending: false` and the block timestamp, `Replaced` with `replacedTxHash`, or `Failed` with the normalized
 * error. The transaction is never removed from the pool.
 *
 * The callbacks receive the transaction with every update written by the tracker (`createTxUpdater` from
 * `@tuwaio/pulsar-core`). A reverted transaction calls `onError` with `Error('Transaction reverted')`.
 *
 * @template T - The application transaction type.
 * @param params - The transaction, the wagmi config, the store members and the callbacks.
 * @returns A promise that resolves when tracking has finished.
 */
export async function evmTrackerForStore<T extends Transaction>(
  params: Pick<EVMTrackerParams, 'config'> &
    Pick<ITxTrackingStore<T>, 'updateTxParams' | 'transactionsPool'> & {
      tx: T;
    } & TrackerCallbacks<T>,
) {
  const { tx, config, updateTxParams, transactionsPool, onSuccess, onError, onReplaced } = params;
  const updateTx = createTxUpdater({ tx, transactionsPool, updateTxParams });

  return evmTracker({
    tx,
    config,
    onInitialize: () => {
      updateTx({ hash: tx.txKey as Hex });
    },
    onTxDetailsFetched: (txDetails) => {
      updateTx({
        to: txDetails.to ?? undefined,
        input: txDetails.input,
        value: txDetails.value?.toString(),
        nonce: txDetails.nonce,
        maxFeePerGas: txDetails.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: txDetails.maxPriorityFeePerGas?.toString(),
      });
    },
    onConfirmationsUpdate: (confirmations) => {
      updateTx({ confirmations });
    },
    onSuccess: async (txDetails, receipt, client) => {
      const block = await getBlock(client, { blockNumber: receipt.blockNumber });
      const timestamp = Number(block.timestamp);
      const isSuccess = receipt.status === 'success';

      const updatedTx = updateTx({
        status: isSuccess ? TransactionStatus.Success : TransactionStatus.Failed,
        isError: !isSuccess,
        pending: false,
        finishedTimestamp: timestamp,
      });

      if (isSuccess && onSuccess && updatedTx) {
        onSuccess(updatedTx);
      }
      if (!isSuccess && onError && updatedTx) {
        onError(new Error('Transaction reverted'), updatedTx);
      }
    },
    onReplaced: (replacement) => {
      const updatedTx = updateTx({
        status: TransactionStatus.Replaced,
        replacedTxHash: replacement.transaction.hash,
        pending: false,
      });

      if (onReplaced && updatedTx) {
        onReplaced(updatedTx, tx);
      }
    },
    onFailure: (error) => {
      const updatedTx = updateTx({
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        error: normalizeError(error),
      });

      if (onError && updatedTx) {
        onError(error, updatedTx);
      }
    },
  });
}
