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
import { Config } from '@wagmi/core';
import dayjs from 'dayjs';
import { Hex } from 'viem';
import type { GetUserOperationReceiptReturnType } from 'viem/account-abstraction';
import { getBlock } from 'viem/actions';

import { evmTracker } from './evmTracker';

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
    stopPolling({ withoutRemoving: true });
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
    stopPolling({ withoutRemoving: true });
    onSuccess({
      receipt,
      status: 'success',
      hash: txHash,
    });
  } else {
    stopPolling({ withoutRemoving: true });
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
 * Parameters for the store-connected ERC-4337 tracker.
 */
export type Erc4337TrackerForStoreParams<T extends Transaction> = Pick<
  ITxTrackingStore<T>,
  'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'
> & {
  tx: T;
  config?: Config;
} & TrackerCallbacks<T>;

/**
 * High-level two-stage tracker for ERC-4337 UserOperations integrated with the Pulsar store.
 *
 * - Stage 1 (Bundler Mempool): Polls `eth_getUserOperationReceipt` against the Bundler RPC.
 *   As soon as the UserOp is bundled on-chain, writes `tx.hash` to the store and stops Bundler polling
 *   without evicting the transaction from the pool.
 * - Stage 2 (EVM On-Chain Finality): Hands off tracking to `evmTracker` for on-chain block confirmations,
 *   block timestamp resolution, and final terminal status update.
 *
 * Supports seamless session restoration across page reloads: if `tx.hash` is already populated,
 * Stage 1 is bypassed and tracking resumes directly at Stage 2.
 *
 * @param params - The store actions, Wagmi config, and transaction object to track.
 */
export async function erc4337TrackerForStore<T extends Transaction>({
  tx,
  config,
  updateTxParams,
  transactionsPool,
  onSuccess,
  onError,
  onReplaced,
}: Erc4337TrackerForStoreParams<T>): Promise<void> {
  // Helper to execute Stage 2 EVM on-chain tracking once the on-chain hash is known
  const runOnChainStage = async (txHash: Hex): Promise<void> => {
    if (config) {
      return evmTracker({
        tx: {
          chainId: tx.chainId,
          txKey: txHash,
          requiredConfirmations: tx.requiredConfirmations,
        },
        config,
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
        onSuccess: async (_txDetails, receipt, client) => {
          const block = await getBlock(client, { blockNumber: receipt.blockNumber });
          const timestamp = Number(block.timestamp);
          const isSuccess = receipt.status === 'success';

          updateTxParams(tx.txKey, {
            status: isSuccess ? TransactionStatus.Success : TransactionStatus.Failed,
            isError: !isSuccess,
            pending: false,
            hash: txHash,
            finishedTimestamp: timestamp,
          });

          const updatedTx = transactionsPool[tx.txKey];
          if (isSuccess && onSuccess && updatedTx) {
            onSuccess(updatedTx);
          }
          if (!isSuccess && onError && updatedTx) {
            onError(new Error('Transaction reverted on-chain.'), updatedTx);
          }
        },
        onFailure: (error) => {
          updateTxParams(tx.txKey, {
            status: TransactionStatus.Failed,
            pending: false,
            isError: true,
            hash: txHash,
            error: normalizeError(error),
            finishedTimestamp: dayjs().unix(),
          });

          const updatedTx = transactionsPool[tx.txKey];
          if (onError && updatedTx) {
            onError(error, updatedTx);
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
      });
    }

    // Fallback if no Wagmi config is provided (standalone mode)
    updateTxParams(tx.txKey, {
      status: TransactionStatus.Success,
      pending: false,
      isError: false,
      hash: txHash,
      finishedTimestamp: dayjs().unix(),
    });

    const updatedTx = transactionsPool[tx.txKey];
    if (onSuccess && updatedTx) {
      onSuccess(updatedTx);
    }
  };

  const evmTx = tx as unknown as EvmTransaction;

  // Session restoration: if tx already has an on-chain hash, skip Stage 1 and resume Stage 2
  if (evmTx.hash) {
    return runOnChainStage(evmTx.hash);
  }

  // Stage 1: Bundler Mempool Polling
  initializePollingTracker<Erc4337FetchResult, T>({
    tx,
    fetcher: erc4337Fetcher,
    // CRITICAL: Do NOT pass removeTxFromPool to prevent premature eviction from the store
    pollingInterval: 2000,
    maxRetries: 60,
    onSuccess: async (response) => {
      const hash = response.hash;

      if (!hash) {
        updateTxParams(tx.txKey, {
          status: TransactionStatus.Success,
          pending: false,
          isError: false,
          finishedTimestamp: dayjs().unix(),
        });

        const updatedTx = transactionsPool[tx.txKey];
        if (onSuccess && updatedTx) {
          onSuccess(updatedTx);
        }
        return;
      }

      // Immediately commit the on-chain hash to the store so the UI displays it
      updateTxParams(tx.txKey, { hash });

      // Hand off to Stage 2 (EVM On-Chain Confirmation & Finality)
      await runOnChainStage(hash);
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
