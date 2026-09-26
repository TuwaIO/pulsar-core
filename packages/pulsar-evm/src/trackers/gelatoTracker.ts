/**
 * @file The deprecated tracker for Gelato relay tasks. It polls `relayer_getStatus` on the Gelato RPC endpoint and maps
 * the numeric status codes to Pulsar statuses.
 */

import { normalizeError } from '@tuwaio/orbit-core';
import {
  createTxUpdater,
  initializePollingTracker,
  ITxTrackingStore,
  PollingFetcherParams,
  TrackerCallbacks,
  Transaction,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { Hex, Transport } from 'viem';

import { createGelatoClient } from '../utils/createGelatoClient';

// =================================================================================================
// 1. TYPES
// =================================================================================================

/**
 * Numeric status codes returned by the Gelato `relayer_getStatus` RPC method.
 *
 * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.
 * @see {@link https://docs.gelato.cloud/ Gelato documentation}
 */
export enum GelatoStatusCode {
  /** The task has been received and is awaiting execution. */
  Pending = 100,
  /** The task has been submitted to the mempool and has a transaction hash. */
  Submitted = 110,
  /** The task was successfully executed and mined. */
  Success = 200,
  /** The task was rejected by the relayer before execution (e.g., validation failure). */
  Rejected = 400,
  /** The task was submitted but the transaction reverted on-chain. */
  Reverted = 500,
}

/**
 * Fields shared by every Gelato task status response.
 *
 * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.
 */
export type GelatoBaseStatus = {
  /** The chain ID on which the task was submitted. */
  chainId: number;
  /** Unix timestamp (in seconds) when the task was created. */
  createdAt: number;
  /** The unique Gelato task identifier. */
  id: string;
};

/**
 * A Gelato task status response, discriminated by `status` ({@link GelatoStatusCode}).
 *
 * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.
 */
export type GelatoTaskStatus =
  | (GelatoBaseStatus & { status: GelatoStatusCode.Pending })
  | (GelatoBaseStatus & { status: GelatoStatusCode.Submitted; hash: Hex })
  | (GelatoBaseStatus & { status: GelatoStatusCode.Success; receipt: { transactionHash: Hex } })
  | (GelatoBaseStatus & { status: GelatoStatusCode.Rejected; message: string; data?: unknown })
  | (GelatoBaseStatus & {
      status: GelatoStatusCode.Reverted;
      message?: string;
      data: string;
      receipt: { transactionHash: Hex };
    });

// =================================================================================================
// 2. HELPER FUNCTIONS
// =================================================================================================

/** The set of status codes that represent a terminal (non-pending) state. */
const GELATO_TERMINAL_STATES = new Set<GelatoStatusCode>([
  GelatoStatusCode.Success,
  GelatoStatusCode.Rejected,
  GelatoStatusCode.Reverted,
]);

/**
 * Determines whether a Gelato task is still in a pending (non-terminal) state.
 *
 * @param {GelatoStatusCode} status - The current status code of the task.
 * @returns {boolean} `true` if the task is still pending, `false` if it has reached a terminal state.
 */
function isGelatoTxPending(status: GelatoStatusCode): boolean {
  return !GELATO_TERMINAL_STATES.has(status);
}

// =================================================================================================
// 3. FETCHER FACTORY
// =================================================================================================

/**
 * Creates a fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that checks a Gelato task (`tx.txKey`)
 * once through `relayer_getStatus`.
 *
 * On every tick it calls `onIntervalTick` with the status. {@link GelatoStatusCode.Success} calls `onSuccess`;
 * {@link GelatoStatusCode.Rejected} and {@link GelatoStatusCode.Reverted} call `onFailure`; both stop polling and keep
 * the transaction. A task still pending one hour after `createdAt` calls `onFailure` with its status and stops polling,
 * keeping the transaction. Request errors are thrown, so the polling tracker counts them as failed attempts.
 *
 * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` and {@link erc4337Fetcher} instead.
 * @param client - A transport created by {@link createGelatoClient}.
 * @returns The fetcher.
 */
export function gelatoFetcher(
  client: ReturnType<Transport>,
): (params: PollingFetcherParams<GelatoTaskStatus, Pick<Transaction, 'txKey'>>) => Promise<void> {
  return async ({ tx, stopPolling, onSuccess, onFailure, onIntervalTick }) => {
    const result = (await client.request({
      method: 'relayer_getStatus',
      params: { id: tx.txKey, logs: false },
    })) as GelatoTaskStatus;

    onIntervalTick?.(result);

    const { status, createdAt } = result;

    // Safeguard: give up on tasks that have been pending for over an hour.
    // `createdAt` is a Unix timestamp in seconds.
    if (createdAt && dayjs().diff(dayjs.unix(createdAt), 'hour') >= 1 && isGelatoTxPending(status)) {
      onFailure(result);
      stopPolling({ withoutRemoving: true });
      return;
    }

    // Check for terminal states to stop the polling.
    if (status === GelatoStatusCode.Success) {
      onSuccess(result);
      stopPolling({ withoutRemoving: true });
    } else if (status === GelatoStatusCode.Rejected || status === GelatoStatusCode.Reverted) {
      onFailure(result);
      stopPolling({ withoutRemoving: true });
    }
  };
}

// =================================================================================================
// 4. STORE-CONNECTED TRACKER
// =================================================================================================

/**
 * Tracks a Gelato task of the Pulsar store with {@link gelatoFetcher} (every 5 s, up to 10 consecutive failed
 * attempts) and writes the results to the store: the transaction `hash` once the task is submitted, then `Success` or
 * `Failed` with the local time as `finishedTimestamp`.
 *
 * When tracking gives up (10 consecutive failed attempts, or the task still pending after one hour), the transaction
 * is marked `Failed` and stays in the pool.
 *
 * Side effects: sends requests to the Gelato API with `gelatoApiKey` (see {@link createGelatoClient}). The callbacks
 * receive the transaction with every update written by the tracker.
 *
 * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` and {@link erc4337TrackerForStore} instead.
 * @template T - The application transaction type.
 * @param params - The transaction, the Gelato API key, the store members and the callbacks.
 * @param params.tx - The transaction to track; `txKey` is the Gelato task ID.
 * @param params.gelatoApiKey - The Gelato API key.
 * @param params.updateTxParams - The store's `updateTxParams`.
 * @param params.removeTxFromPool - Not used: failed transactions stay in the pool.
 * @param params.transactionsPool - The store's pool when tracking starts.
 * @param params.onSuccess - Called when the task succeeded.
 * @param params.onError - Called when the task failed or tracking gave up.
 */
export function gelatoTrackerForStore<T extends Transaction>({
  tx,
  gelatoApiKey,
  updateTxParams,
  transactionsPool,
  onSuccess,
  onError,
}: Pick<ITxTrackingStore<T>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'> & {
  tx: T;
  gelatoApiKey: string;
} & TrackerCallbacks<T>) {
  const client = createGelatoClient({ apiKey: gelatoApiKey });
  const fetcher = gelatoFetcher(client);
  const updateTx = createTxUpdater({ tx, transactionsPool, updateTxParams });

  return initializePollingTracker<GelatoTaskStatus, T>({
    tx,
    fetcher,
    // `removeTxFromPool` is not passed: failed transactions stay in the pool as `Failed`.
    onSuccess: (response) => {
      const hash = response.status === GelatoStatusCode.Success ? response.receipt.transactionHash : undefined;

      const updatedTx = updateTx({
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
        hash,
        finishedTimestamp: dayjs().unix(),
      });

      if (onSuccess && updatedTx) {
        onSuccess(updatedTx);
      }
    },
    onIntervalTick: (response) => {
      // Update the on-chain hash as soon as the task is submitted to the mempool.
      if (response.status === GelatoStatusCode.Submitted) {
        updateTx({
          hash: response.hash,
        });
      }
    },
    onFailure: (response) => {
      let errorMessage = 'Transaction failed or was not found.';
      let hash: Hex | undefined;

      if (response) {
        if (response.status === GelatoStatusCode.Rejected) {
          errorMessage = response.message || 'Transaction was rejected by Gelato Relay.';
        } else if (response.status === GelatoStatusCode.Reverted) {
          errorMessage = response.message || 'Transaction reverted on-chain.';
          hash = response.receipt.transactionHash;
        } else {
          errorMessage = 'Gelato task was not executed within an hour.';
        }
      }

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

/**
 * Alias of {@link gelatoTrackerForStore}.
 *
 * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` and {@link erc4337TrackerForStore} instead.
 */
export const gelatoTracker = gelatoTrackerForStore;
