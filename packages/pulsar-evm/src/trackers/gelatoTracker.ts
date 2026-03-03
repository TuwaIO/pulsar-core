/**
 * @file This file implements the transaction tracking logic for meta-transactions relayed via the Gelato Network.
 * It uses a polling mechanism to check the status of a Gelato task via the authenticated Gelato RPC client.
 *
 * The fetcher calls `relayer_getStatus` on the Gelato RPC endpoint and interprets the numeric
 * status codes to determine whether a task is still pending, succeeded, was rejected, or reverted.
 */

import { normalizeError } from '@tuwaio/orbit-core';
import {
  initializePollingTracker,
  ITxTrackingStore,
  PollingTrackerConfig,
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
 * @see https://docs.gelato.cloud/
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
 * Common fields shared by all Gelato task status responses.
 */
type GelatoBaseStatus = {
  /** The chain ID on which the task was submitted. */
  chainId: number;
  /** Unix timestamp (in seconds) when the task was created. */
  createdAt: number;
  /** The unique Gelato task identifier. */
  id: string;
};

/**
 * Discriminated union representing all possible Gelato task status responses.
 * Each variant corresponds to a specific {@link GelatoStatusCode}.
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
 * Creates a reusable fetcher function for `initializePollingTracker` that queries the
 * Gelato RPC endpoint (`relayer_getStatus`) for a task's status using an authenticated client.
 *
 * The fetcher interprets the numeric status codes and calls the appropriate polling callbacks:
 * - {@link GelatoStatusCode.Success} → `onSuccess`
 * - {@link GelatoStatusCode.Rejected} / {@link GelatoStatusCode.Reverted} → `onFailure`
 * - {@link GelatoStatusCode.Submitted} → `onIntervalTick` (to update the tx hash)
 *
 * @param {ReturnType<Transport>} client - A viem transport client configured for the Gelato API.
 * @returns {PollingTrackerConfig<GelatoTaskStatus, Transaction>['fetcher']} The fetcher function.
 */
export function gelatoFetcher(
  client: ReturnType<Transport>,
): PollingTrackerConfig<GelatoTaskStatus, Transaction>['fetcher'] {
  return async ({ tx, stopPolling, onSuccess, onFailure, onIntervalTick }) => {
    const result = (await client.request({
      method: 'relayer_getStatus',
      params: { id: tx.txKey, logs: false },
    })) as GelatoTaskStatus;

    onIntervalTick?.(result);

    const { status, createdAt } = result;

    // Safeguard: Stop polling for tasks that have been pending for over an hour.
    // `createdAt` is a Unix timestamp in seconds.
    if (createdAt && dayjs().diff(dayjs.unix(createdAt), 'hour') >= 1 && isGelatoTxPending(status)) {
      stopPolling();
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
 * A higher-level wrapper that integrates the Gelato polling logic with the Pulsar store.
 * It creates an authenticated Gelato RPC client and uses {@link gelatoFetcher} to
 * build the fetcher, then delegates to `initializePollingTracker` with store-specific callbacks.
 *
 * @template T - The application-specific transaction type.
 *
 * @param params.tx - The transaction to track.
 * @param params.gelatoApiKey - The Gelato API key for authenticating RPC requests.
 * @param params.updateTxParams - Store action to update transaction fields.
 * @param params.removeTxFromPool - Store action to remove a transaction from the pool.
 * @param params.transactionsPool - The current pool of tracked transactions.
 * @param params.onSuccess - Optional callback invoked when the transaction succeeds.
 * @param params.onError - Optional callback invoked when the transaction fails.
 */
export function gelatoTrackerForStore<T extends Transaction>({
  tx,
  gelatoApiKey,
  updateTxParams,
  removeTxFromPool,
  transactionsPool,
  onSuccess,
  onError,
}: Pick<ITxTrackingStore<T>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'> & {
  tx: T;
  gelatoApiKey: string;
} & TrackerCallbacks<T>) {
  const client = createGelatoClient({ apiKey: gelatoApiKey });
  const fetcher = gelatoFetcher(client);

  return initializePollingTracker<GelatoTaskStatus, T>({
    tx,
    fetcher,
    removeTxFromPool,
    onSuccess: (response) => {
      const hash = response.status === GelatoStatusCode.Success ? response.receipt.transactionHash : undefined;

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
      // Update the on-chain hash as soon as the task is submitted to the mempool.
      if (response.status === GelatoStatusCode.Submitted) {
        updateTxParams(tx.txKey, {
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
        }
      }

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
