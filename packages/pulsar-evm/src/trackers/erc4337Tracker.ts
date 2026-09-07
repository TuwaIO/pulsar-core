/**
 * @file This file implements transaction tracking for ERC-4337 UserOperations.
 * It uses a polling mechanism against a Bundler RPC endpoint (e.g., Pimlico)
 * to check the status of a UserOperation via `eth_getUserOperationReceipt`.
 */

import { normalizeError } from '@tuwaio/orbit-core';
import { createBundlerRpcClient } from '@tuwaio/orbit-evm';
import {
  EvmTransaction,
  initializePollingTracker,
  ITxTrackingStore,
  PollingTrackerConfig,
  TrackerCallbacks,
  Transaction,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { Hex } from 'viem';
import type { GetUserOperationReceiptReturnType } from 'viem/account-abstraction';

/**
 * The receipt returned by `getUserOperationReceipt`.
 */
export type Erc4337UserOpReceipt = GetUserOperationReceiptReturnType;

/**
 * Result structure produced by `erc4337Fetcher` on each polling cycle.
 */
export type Erc4337FetchResult = {
  receipt: Erc4337UserOpReceipt | null;
  status: 'pending' | 'success' | 'failed';
  hash?: Hex;
  reason?: string;
};

type Erc4337FetcherParams<T extends Transaction> = Parameters<
  PollingTrackerConfig<Erc4337FetchResult, T>['fetcher']
>[0];

/**
 * Low-level fetcher for ERC-4337 UserOperation status.
 * Queries `eth_getUserOperationReceipt` on the configured Bundler client.
 *
 * @param params - The fetcher parameters provided by the polling tracker.
 */
export async function erc4337Fetcher<T extends Transaction>({
  tx,
  stopPolling,
  onSuccess,
  onFailure,
  onIntervalTick,
}: Erc4337FetcherParams<T>): Promise<void> {
  const evmTx = tx as unknown as EvmTransaction;
  const rawChainId = evmTx.chainId;
  const chainId = typeof rawChainId === 'number' ? rawChainId : parseInt(String(rawChainId), 10);

  if (!chainId || Number.isNaN(chainId)) {
    stopPolling();
    onFailure({
      receipt: null,
      status: 'failed',
      reason: `Invalid chainId: ${String(rawChainId)}`,
    });
    return;
  }

  const client = createBundlerRpcClient({
    chainId,
    apiKey: evmTx.pimlicoApiKey,
    bundlerUrl: evmTx.bundlerUrl,
  });

  let receipt: Erc4337UserOpReceipt | null;

  try {
    receipt = await client.getUserOperationReceipt({
      hash: evmTx.txKey as Hex,
    });
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string; shortMessage?: string; details?: string };
    const isReceiptNotFound =
      error?.name === 'UserOperationReceiptNotFoundError' ||
      error?.message?.includes('could not be found') ||
      error?.shortMessage?.includes('could not be found') ||
      error?.details?.includes('could not be found') ||
      error?.message?.includes('not been processed yet') ||
      error?.shortMessage?.includes('not been processed yet');

    if (isReceiptNotFound) {
      onIntervalTick?.({
        receipt: null,
        status: 'pending',
      });
      return;
    }

    // Re-throw transient network/RPC errors to allow polling tracker to retry
    throw err;
  }

  if (!receipt) {
    onIntervalTick?.({
      receipt: null,
      status: 'pending',
    });
    return;
  }

  const txHash = (receipt.receipt?.transactionHash ??
    (receipt as unknown as { transactionHash?: Hex }).transactionHash) as Hex | undefined;

  if (receipt.success) {
    stopPolling();
    onSuccess({
      receipt,
      status: 'success',
      hash: txHash,
    });
  } else {
    stopPolling();
    onFailure({
      receipt,
      status: 'failed',
      hash: txHash,
      reason: receipt.reason ?? 'UserOperation reverted on-chain.',
    });
  }
}

/**
 * Configuration options for the low-level ERC-4337 tracker.
 */
export type Erc4337TrackerConfig<T extends Transaction> = {
  tx: T & Pick<Transaction, 'txKey' | 'pending'>;
  onSuccess: (result: Erc4337FetchResult) => void;
  onFailure: (result?: Erc4337FetchResult) => void;
  onIntervalTick?: (result: Erc4337FetchResult) => void;
  removeTxFromPool?: (txKey: string) => void;
  pollingInterval?: number;
  maxRetries?: number;
};

/**
 * Initializes a low-level polling tracker for ERC-4337 UserOperations.
 *
 * @param config - The tracker configuration options.
 */
export function erc4337Tracker<T extends Transaction>(config: Erc4337TrackerConfig<T>) {
  return initializePollingTracker<Erc4337FetchResult, T>({
    ...config,
    fetcher: erc4337Fetcher,
    pollingInterval: config.pollingInterval ?? 2000,
    maxRetries: config.maxRetries ?? 60,
  });
}

/**
 * High-level tracker that connects ERC-4337 UserOperation polling to the Zustand store.
 *
 * @param params - The store actions and transaction object to track.
 */
export function erc4337TrackerForStore<T extends Transaction>({
  tx,
  updateTxParams,
  removeTxFromPool,
  transactionsPool,
  onSuccess,
  onError,
}: Pick<ITxTrackingStore<T>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'> & {
  tx: T;
} & TrackerCallbacks<T>) {
  return initializePollingTracker<Erc4337FetchResult, T>({
    tx,
    fetcher: erc4337Fetcher,
    removeTxFromPool,
    pollingInterval: 2000,
    maxRetries: 60,
    onSuccess: (response) => {
      const hash = response.hash;

      updateTxParams(tx.txKey, {
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
        hash,
        finishedTimestamp: dayjs().unix(),
      });

      const updatedTx = transactionsPool[tx.txKey];
      if (onSuccess && updatedTx) {
        onSuccess(updatedTx);
      }
    },
    onIntervalTick: (response) => {
      if (response.hash) {
        updateTxParams(tx.txKey, {
          hash: response.hash,
        });
      }
    },
    onFailure: (response) => {
      const errorMessage = response?.reason || 'UserOperation failed or was not found.';
      const hash = response?.hash;
      const err = new Error(errorMessage);

      updateTxParams(tx.txKey, {
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        hash,
        error: normalizeError(err),
        finishedTimestamp: dayjs().unix(),
      });

      const updatedTx = transactionsPool[tx.txKey];
      if (onError && updatedTx) {
        onError(err, updatedTx);
      }
    },
  });
}
