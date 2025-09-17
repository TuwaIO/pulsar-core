/**
 * @file This file implements the transaction tracking logic for meta-transactions relayed via the Gelato Network.
 * It uses a polling mechanism to check the status of a Gelato Task ID from the Gelato API.
 */

import {
  initializePollingTracker,
  ITxTrackingStore,
  PollingTrackerConfig,
  Transaction,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { Hex } from 'viem';

import { ActionTxKey, TransactionTracker } from '../types';

// =================================================================================================
// 1. TYPES AND TYPE GUARDS
// =================================================================================================

/**
 * Defines the shape of the identifier for a Gelato transaction task.
 */
export type GelatoTxKey = {
  taskId: string;
};

/**
 * A type guard to determine if an ActionTxKey is a GelatoTxKey.
 * @param {ActionTxKey} txKey - The transaction key to check.
 * @returns {boolean} True if the key is for a Gelato transaction.
 */
export function isGelatoTxKey(txKey: ActionTxKey): txKey is GelatoTxKey {
  return typeof txKey === 'object' && txKey !== null && 'taskId' in txKey;
}

/**
 * Enum representing the possible states of a Gelato task.
 * @see https://docs.gelato.network/developer-services/relay/api/get-task-status
 */
export enum GelatoTaskState {
  CheckPending = 'CheckPending',
  ExecPending = 'ExecPending',
  WaitingForConfirmation = 'WaitingForConfirmation',
  ExecSuccess = 'ExecSuccess',
  ExecReverted = 'ExecReverted',
  Cancelled = 'Cancelled',
  NotFound = 'NotFound',
}

/**
 * Defines the shape of the response from the Gelato `getTaskStatus` API endpoint.
 */
export type GelatoTaskStatusResponse = {
  task: {
    chainId: number;
    taskId: string;
    taskState: GelatoTaskState;
    creationDate?: string;
    executionDate?: string;
    transactionHash?: Hex;
    blockNumber?: number;
    lastCheckMessage?: string;
  };
};

const GELATO_API_BASE_URL = 'https://api.gelato.digital/tasks/status/';

// =================================================================================================
// 2. HELPER FUNCTIONS
// =================================================================================================

const GELATO_TERMINAL_FAILURE_STATES = new Set([
  GelatoTaskState.ExecReverted,
  GelatoTaskState.Cancelled,
  GelatoTaskState.NotFound,
]);

function isGelatoTxPending(gelatoStatus: GelatoTaskState): boolean {
  return gelatoStatus !== GelatoTaskState.ExecSuccess && !GELATO_TERMINAL_FAILURE_STATES.has(gelatoStatus);
}

// =================================================================================================
// 3. FETCHER IMPLEMENTATION
// =================================================================================================

/**
 * A reusable fetcher function for `initializePollingTracker` that queries the Gelato API for a task's status.
 * It handles the logic for interpreting Gelato's task states and calls the appropriate polling callbacks.
 */
export const gelatoFetcher: PollingTrackerConfig<
  GelatoTaskStatusResponse,
  Transaction<TransactionTracker>,
  TransactionTracker
>['fetcher'] = async ({ tx, stopPolling, onSuccess, onFailure, onIntervalTick }) => {
  const response = await fetch(`${GELATO_API_BASE_URL}${tx.txKey}`);

  if (!response.ok) {
    if (response.status === 404) {
      onFailure(); // Treat 404 as a terminal failure.
      stopPolling({ withoutRemoving: true });
      return;
    }
    // For other errors, let the polling tracker's retry mechanism handle it.
    throw new Error(`Gelato API responded with status: ${response.status}`);
  }

  const data = (await response.json()) as GelatoTaskStatusResponse;
  const { taskState, creationDate } = data.task;

  onIntervalTick?.(data);

  // Safeguard: Stop polling for tasks that have been pending for over a day.
  if (creationDate && dayjs().diff(dayjs(creationDate), 'day') >= 1 && isGelatoTxPending(taskState)) {
    stopPolling({ withoutRemoving: true });
    return;
  }

  // Check for terminal states to stop the polling.
  if (taskState === GelatoTaskState.ExecSuccess) {
    onSuccess(data);
    stopPolling({ withoutRemoving: true });
  } else if (GELATO_TERMINAL_FAILURE_STATES.has(taskState)) {
    onFailure(data);
    stopPolling({ withoutRemoving: true });
  }
};

// =================================================================================================
// 4. STORE-CONNECTED TRACKER
// =================================================================================================

/**
 * A higher-level wrapper that integrates the Gelato polling logic with the Pulsar store.
 * It uses the generic `gelatoFetcher` and provides store-specific callbacks.
 *
 * @template T - The application-specific transaction type.
 */
export function gelatoTrackerForStore<T extends Transaction<TransactionTracker>>({
  tx,
  transactionsPool,
  updateTxParams,
  onSucceedCallbacks,
  removeTxFromPool,
}: Pick<
  ITxTrackingStore<TransactionTracker, T, ActionTxKey>,
  'transactionsPool' | 'updateTxParams' | 'onSucceedCallbacks' | 'removeTxFromPool'
> & {
  tx: T;
}) {
  return initializePollingTracker<GelatoTaskStatusResponse, T, TransactionTracker>({
    tx,
    fetcher: gelatoFetcher, // Use the exported, reusable fetcher
    removeTxFromPool,
    onSuccess: (response) => {
      updateTxParams(tx.txKey, {
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
        hash: response.task.transactionHash,
        finishedTimestamp: response.task.executionDate ? dayjs(response.task.executionDate).unix() : undefined,
      });

      const updatedTx = transactionsPool[tx.txKey];
      if (onSucceedCallbacks && updatedTx) {
        onSucceedCallbacks(updatedTx);
      }
    },
    onIntervalTick: (response) => {
      updateTxParams(tx.txKey, {
        hash: response.task.transactionHash,
      });
    },
    onFailure: (response) => {
      updateTxParams(tx.txKey, {
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        hash: response?.task.transactionHash,
        errorMessage: response?.task.lastCheckMessage ?? 'Transaction failed or was not found.',
        finishedTimestamp: response?.task.executionDate ? dayjs(response.task.executionDate).unix() : undefined,
      });
    },
  });
}
