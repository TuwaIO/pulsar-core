/**
 * @file The tracker for EIP-5792 call batches. It polls the wallet's `wallet_getCallsStatus` through wagmi and, once the
 * batch is executed, tracks the transaction on-chain.
 */

import { normalizeError } from '@tuwaio/orbit-core';
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
import { Config, getCallsStatus } from '@wagmi/core';
import dayjs from 'dayjs';
import { Hex } from 'viem';

import { trackOnChainStage } from './onChainStage';

/** Why a batch failed, by the EIP-5792 status code the wallet reports. */
const FAILURE_REASONS: Record<number, string> = {
  400: 'The wallet did not send the calls.',
  500: 'The calls reverted on-chain.',
  600: 'Some calls reverted on-chain.',
};

/**
 * The result {@link createEip5792Fetcher}'s fetcher reports on each polling tick.
 */
export type Eip5792FetchResult = {
  /** `pending` while the wallet has not executed the batch, then `success` or `failed`. */
  status: 'pending' | 'success' | 'failed';
  /** The EIP-5792 status code the wallet reported (100 pending, 200 confirmed, 400, 500, 600 failures). */
  statusCode?: number;
  /** The hash of the transaction that executed the batch (its last receipt), once known. */
  hash?: Hex;
  /** The failure reason. */
  reason?: string;
};

/** The transaction fields the fetcher reads: the batch ID as `txKey`. */
export type Eip5792FetcherTx = Pick<Transaction, 'txKey'>;

/**
 * Creates a fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that asks the connected wallet once for
 * the status of an EIP-5792 call batch (`getCallsStatus` of `@wagmi/core`, `wallet_getCallsStatus`). The status comes
 * from the wallet, not from a public RPC: the wallet that sent the batch must be connected in `config`.
 *
 * - Pending: calls `onIntervalTick` with `status: 'pending'`.
 * - Executed with every receipt `success`: stops polling (keeping the transaction) and calls `onSuccess` with the hash
 *   of the last receipt.
 * - Failed (status codes 400, 500, 600) or a reverted receipt: stops polling (keeping the transaction) and calls
 *   `onFailure` with the reason and the hash, if any.
 * - An error (no connected wallet, a wallet without EIP-5792) is rethrown, so the polling tracker counts it as a failed
 *   attempt.
 *
 * @param config - The wagmi config with the wallet that sent the batch.
 * @returns The fetcher.
 */
export function createEip5792Fetcher(config: Config) {
  return async function eip5792Fetcher<T extends Eip5792FetcherTx>({
    tx,
    stopPolling,
    onSuccess,
    onFailure,
    onIntervalTick,
  }: PollingFetcherParams<Eip5792FetchResult, T>): Promise<void> {
    const status = await getCallsStatus(config, { id: tx.txKey });
    const receipts = status.receipts ?? [];
    const hash = receipts.at(-1)?.transactionHash;

    if (status.status === 'success' && receipts.every((receipt) => receipt.status === 'success')) {
      stopPolling({ withoutRemoving: true });
      onSuccess({ status: 'success', statusCode: status.statusCode, hash });
      return;
    }
    if (status.status === 'failure' || (status.status === 'success' && receipts.length > 0)) {
      stopPolling({ withoutRemoving: true });
      onFailure({
        status: 'failed',
        statusCode: status.statusCode,
        ...(hash ? { hash } : {}),
        reason: FAILURE_REASONS[status.statusCode] ?? 'The calls reverted on-chain.',
      });
      return;
    }
    onIntervalTick?.({ status: 'pending', statusCode: status.statusCode });
  };
}

/**
 * The configuration of {@link eip5792Tracker}.
 *
 * @template T - The tracked transaction type.
 */
export type Eip5792TrackerConfig<T extends Eip5792FetcherTx & Pick<Transaction, 'pending'>> = {
  /** The batch to track; `txKey` is the batch ID. Polling starts only if `pending` is `true`. */
  tx: T;
  /** The wagmi config with the wallet that sent the batch. */
  config: Config;
  /**
   * Called when the batch was executed.
   * @param result - The result; `hash` is the transaction that executed it.
   */
  onSuccess: (result: Eip5792FetchResult) => void;
  /**
   * Called when the batch failed, and without arguments after `maxRetries` consecutive failed attempts.
   * @param result - The result with the failure `reason`, if any.
   */
  onFailure: (result?: Eip5792FetchResult) => void;
  /**
   * Called on every tick while the batch is pending.
   * @param result - The pending result.
   */
  onIntervalTick?: (result: Eip5792FetchResult) => void;
  /** The delay before each attempt, in milliseconds. Defaults to 2000. */
  pollingInterval?: number;
  /** The number of consecutive failed attempts after which polling stops. Defaults to 60. */
  maxRetries?: number;
};

/**
 * Starts polling an EIP-5792 call batch in the background without a store: the wallet's status every 2 s by default,
 * giving up after 60 consecutive failed attempts. It does not wait for block confirmations of the executing transaction
 * (pass `onSuccess`'s `hash` to {@link evmTracker} for that).
 *
 * @template T - The tracked transaction type.
 * @param params - The batch, the wagmi config and the callbacks.
 * @returns The promise of `initializePollingTracker`, which resolves once polling has started.
 *
 * @example
 * ```ts
 * const { id } = await sendCalls(wagmiConfig, { calls });
 * eip5792Tracker({
 *   tx: { txKey: id, pending: true },
 *   config: wagmiConfig,
 *   onSuccess: ({ hash }) => console.log('Executed in', hash),
 *   onFailure: (result) => console.error('Batch failed', result?.reason),
 * });
 * ```
 */
export function eip5792Tracker<T extends Eip5792FetcherTx & Pick<Transaction, 'pending'>>({
  config,
  ...params
}: Eip5792TrackerConfig<T>) {
  return initializePollingTracker<Eip5792FetchResult, T>({
    ...params,
    fetcher: createEip5792Fetcher(config),
    pollingInterval: params.pollingInterval ?? 2000,
    maxRetries: params.maxRetries ?? 60,
  });
}

/**
 * The parameters of {@link eip5792TrackerForStore}: the transaction, the wagmi config, the store members used by
 * trackers and the callbacks.
 *
 * @template T - The application transaction type.
 */
export type Eip5792TrackerForStoreParams<T extends Transaction> = Pick<
  ITxTrackingStore<T>,
  'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'
> & {
  /** The transaction to track; `txKey` is the batch ID returned by `wallet_sendCalls`. */
  tx: T;
  /** The wagmi config with the wallet that sent the batch; also used for the on-chain stage. */
  config: Config;
} & TrackerCallbacks<T>;

/**
 * Tracks an EIP-5792 call batch of the Pulsar store in two stages and writes the results to the store:
 *
 * 1. Wallet: polls the batch status every 2 s (up to 60 consecutive failed attempts, e.g. while no wallet is
 *    connected). When the wallet has executed the batch, writes the transaction `hash`. A failed batch, or 60 failed
 *    attempts, marks the transaction `Failed`.
 * 2. On-chain: follows the executing transaction with {@link evmTracker} and writes the details, confirmations and the
 *    final `Success`, `Failed` or `Replaced` status.
 *
 * If `tx.hash` is already set (tracking resumed after a reload), stage 1 is skipped. The transaction is never removed
 * from the pool. The callbacks receive the transaction with every update written by the tracker.
 *
 * @template T - The application transaction type.
 * @param params - The transaction, the wagmi config, the store members and the callbacks.
 * @returns A promise that resolves once stage 1 has started, or when stage 2 has finished if it started directly.
 */
export async function eip5792TrackerForStore<T extends Transaction>({
  tx,
  config,
  updateTxParams,
  transactionsPool,
  onSuccess,
  onError,
  onReplaced,
}: Eip5792TrackerForStoreParams<T>): Promise<void> {
  const updateTx = createTxUpdater({ tx, transactionsPool, updateTxParams });
  const onChain = (hash: Hex) => trackOnChainStage({ tx, hash, config, updateTx, onSuccess, onError, onReplaced });

  // Resumed after a reload with the executing transaction known: only the on-chain stage is left
  const known = (tx as unknown as EvmTransaction).hash;
  if (known) return onChain(known);

  initializePollingTracker<Eip5792FetchResult, T>({
    tx,
    fetcher: createEip5792Fetcher(config),
    // Never removeTxFromPool: a transaction that stops being tracked stays in the pool, marked Failed
    pollingInterval: 2000,
    maxRetries: 60,
    onSuccess: async ({ hash }) => {
      if (!hash) {
        const updatedTx = updateTx({
          status: TransactionStatus.Success,
          pending: false,
          isError: false,
          finishedTimestamp: dayjs().unix(),
        });
        if (onSuccess && updatedTx) onSuccess(updatedTx);
        return;
      }
      updateTx({ hash });
      await onChain(hash);
    },
    onFailure: (result) => {
      const error = new Error(result?.reason ?? 'The call batch failed or its status could not be read.');
      const updatedTx = updateTx({
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        ...(result?.hash ? { hash: result.hash } : {}),
        error: normalizeError(error),
        finishedTimestamp: dayjs().unix(),
      });
      if (onError && updatedTx) onError(error, updatedTx);
    },
  });
}
