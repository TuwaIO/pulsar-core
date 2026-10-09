/**
 * @file The tracker for ERC-4337 UserOperations. It polls `eth_getUserOperationReceipt` on a bundler RPC (a custom
 * `bundlerUrl` or Pimlico) and, once the UserOperation is bundled, tracks the bundle transaction on-chain.
 */

import { normalizeError } from '@tuwaio/orbit-core';
import { createBundlerRpcClient } from '@tuwaio/orbit-evm';
import {
  createTxUpdater,
  EvmTransaction,
  initializePollingTracker,
  ITxTrackingStore,
  PollingFetcherParams,
  TrackerCallbacks,
  Transaction,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import { Config } from '@wagmi/core';
import dayjs from 'dayjs';
import { Hex } from 'viem';
import type { GetUserOperationReceiptReturnType } from 'viem/account-abstraction';

import { trackOnChainStage } from './onChainStage';

/**
 * The UserOperation receipt returned by viem's `getUserOperationReceipt`.
 */
export type Erc4337UserOpReceipt = GetUserOperationReceiptReturnType;

/**
 * The result {@link erc4337Fetcher} reports on each polling tick.
 */
export type Erc4337FetchResult = {
  /** The UserOperation receipt, or `null` while it is not available. */
  receipt: Erc4337UserOpReceipt | null;
  /** `pending` while the UserOperation is not bundled, then `success` or `failed`. */
  status: 'pending' | 'success' | 'failed';
  /** The hash of the bundle transaction that included the UserOperation, once known. */
  hash?: Hex;
  /** The failure reason: the revert reason of the receipt, or a validation message. */
  reason?: string;
};

/**
 * The transaction fields {@link erc4337Fetcher} reads: the `userOpHash` as `txKey`, the numeric `chainId`, and either a
 * custom `bundlerUrl` or a `pimlicoApiKey` (without both, the public Pimlico endpoint is used).
 */
export type Erc4337FetcherTx = Pick<Transaction, 'txKey' | 'chainId'> &
  Pick<EvmTransaction, 'pimlicoApiKey' | 'bundlerUrl'>;

/**
 * A fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that checks a UserOperation once through
 * `eth_getUserOperationReceipt`.
 *
 * The bundler client comes from `createBundlerRpcClient` of `@tuwaio/orbit-evm`, which caches it in memory and
 * contacts `tx.bundlerUrl`, else `api.pimlico.io` with `tx.pimlicoApiKey`, else the rate-limited `public.pimlico.io`.
 *
 * - Invalid `chainId`: stops polling (keeping the transaction) and calls `onFailure` with a reason.
 * - Receipt not available yet: calls `onIntervalTick` with `status: 'pending'`.
 * - Receipt with `success: true`: stops polling (keeping the transaction) and calls `onSuccess` with the bundle `hash`.
 * - Receipt with `success: false`: stops polling (keeping the transaction) and calls `onFailure` with the revert reason.
 * - Any other error is rethrown, so the polling tracker counts it as a failed attempt.
 *
 * @template T - The tracked transaction type.
 * @param params - The fetcher parameters provided by `initializePollingTracker`.
 * @returns A promise that resolves when the check is done.
 */
export async function erc4337Fetcher<T extends Erc4337FetcherTx>({
  tx,
  stopPolling,
  onSuccess,
  onFailure,
  onIntervalTick,
}: PollingFetcherParams<Erc4337FetchResult, T>): Promise<void> {
  const rawChainId = tx.chainId;
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
    apiKey: tx.pimlicoApiKey,
    bundlerUrl: tx.bundlerUrl,
  });

  let receipt: Erc4337UserOpReceipt | null;

  try {
    receipt = await client.getUserOperationReceipt({
      hash: tx.txKey as Hex,
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
 * The configuration of {@link erc4337Tracker}.
 *
 * @template T - The tracked transaction type.
 */
export type Erc4337TrackerConfig<T extends Erc4337FetcherTx & Pick<Transaction, 'pending'>> = {
  /** The UserOperation to track (see {@link Erc4337FetcherTx}); polling starts only if `pending` is `true`. */
  tx: T;
  /**
   * Called when the UserOperation succeeded.
   * @param result - The result; `hash` is the bundle transaction hash.
   */
  onSuccess: (result: Erc4337FetchResult) => void;
  /**
   * Called when the UserOperation reverted or the chain ID is invalid, and without arguments after `maxRetries`
   * consecutive failed attempts.
   * @param result - The result with the failure `reason`, if any.
   */
  onFailure: (result?: Erc4337FetchResult) => void;
  /**
   * Called on every tick while the UserOperation is not bundled.
   * @param result - The pending result.
   */
  onIntervalTick?: (result: Erc4337FetchResult) => void;
  /**
   * Called when polling stops after `maxRetries` consecutive failed attempts.
   * @param txKey - The `userOpHash`.
   */
  removeTxFromPool?: (txKey: string) => void;
  /** The delay before each attempt, in milliseconds. Defaults to 2000. */
  pollingInterval?: number;
  /** The number of consecutive failed attempts after which polling stops. Defaults to 60. */
  maxRetries?: number;
};

/**
 * Starts polling a UserOperation in the background with {@link erc4337Fetcher}, without a store: every 2 s by default,
 * giving up after 60 consecutive failed attempts. It only follows the bundler; it does not wait for block
 * confirmations of the bundle transaction (pass `onSuccess`'s `hash` to {@link evmTracker} for that).
 *
 * @template T - The tracked transaction type.
 * @param config - The UserOperation and the callbacks.
 *
 * @example
 * ```ts
 * erc4337Tracker({
 *   tx: { txKey: userOpHash, chainId: 11155111, pimlicoApiKey, pending: true },
 *   onSuccess: ({ hash }) => console.log('Bundled in', hash),
 *   onFailure: (result) => console.error('UserOperation failed', result?.reason),
 * });
 * ```
 */
export function erc4337Tracker<T extends Erc4337FetcherTx & Pick<Transaction, 'pending'>>(
  config: Erc4337TrackerConfig<T>,
) {
  return initializePollingTracker<Erc4337FetchResult, T>({
    ...config,
    fetcher: erc4337Fetcher,
    pollingInterval: config.pollingInterval ?? 2000,
    maxRetries: config.maxRetries ?? 60,
  });
}

/**
 * The parameters of {@link erc4337TrackerForStore}: the transaction, an optional wagmi config, the store members used
 * by trackers and the callbacks.
 *
 * @template T - The application transaction type.
 */
export type Erc4337TrackerForStoreParams<T extends Transaction> = Pick<
  ITxTrackingStore<T>,
  'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'
> & {
  /** The transaction to track; `txKey` is the `userOpHash`. */
  tx: T;
  /** The wagmi config, used for the on-chain stage. Without it, the transaction succeeds as soon as it is bundled. */
  config?: Config;
} & TrackerCallbacks<T>;

/**
 * Tracks an ERC-4337 UserOperation of the Pulsar store in two stages and writes the results to the store:
 *
 * 1. Bundler: polls {@link erc4337Fetcher} every 2 s (up to 60 consecutive failed attempts). When the UserOperation
 *    is bundled, writes the bundle transaction `hash`. A reverted UserOperation, or 60 failed attempts, marks the
 *    transaction `Failed`.
 * 2. On-chain: runs {@link evmTracker} for the bundle transaction and writes the details, confirmations and the final
 *    `Success`, `Failed` or `Replaced` status. Without `config`, the transaction is marked `Success` as soon as it is
 *    bundled.
 *
 * If `tx.hash` is already set (tracking resumed after a reload), stage 1 is skipped. The transaction is never removed
 * from the pool. The callbacks receive the transaction with every update written by the tracker.
 *
 * @template T - The application transaction type.
 * @param params - The transaction, the wagmi config, the store members and the callbacks.
 * @returns A promise that resolves once stage 1 has started, or when stage 2 has finished if it started directly.
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
  const updateTx = createTxUpdater({ tx, transactionsPool, updateTxParams });

  const runOnChainStage = (txHash: Hex) =>
    trackOnChainStage({ tx, hash: txHash, config, updateTx, onSuccess, onError, onReplaced });

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
        const updatedTx = updateTx({
          status: TransactionStatus.Success,
          pending: false,
          isError: false,
          finishedTimestamp: dayjs().unix(),
        });

        if (onSuccess && updatedTx) {
          onSuccess(updatedTx);
        }
        return;
      }

      // Immediately commit the on-chain hash to the store so the UI displays it
      updateTx({ hash });

      // Hand off to Stage 2 (EVM On-Chain Confirmation & Finality)
      await runOnChainStage(hash);
    },
    onIntervalTick: (response) => {
      if (response.hash) {
        updateTx({
          hash: response.hash,
        });
      }
    },
    onFailure: (response) => {
      const errorMessage = response?.reason || 'UserOperation failed or was not found.';
      const hash = response?.hash;
      const err = new Error(errorMessage);

      const updatedTx = updateTx({
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        hash,
        error: normalizeError(err),
        finishedTimestamp: dayjs().unix(),
      });

      if (onError && updatedTx) {
        onError(err, updatedTx);
      }
    },
  });
}
