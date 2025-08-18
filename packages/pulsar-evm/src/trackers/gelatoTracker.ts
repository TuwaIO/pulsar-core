/**
 * @file This file implements the transaction tracking logic for meta-transactions relayed via the Gelato Network.
 * It uses a polling mechanism to check the status of a Gelato Task ID from the Gelato API.
 */

import {
  InitializePollingTracker,
  initializePollingTracker,
  ITxTrackingStore,
  Transaction,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { Hex } from 'viem';

import { ActionTxKey, TransactionTracker } from '../types';

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
  return (txKey as GelatoTxKey).taskId !== undefined;
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

/**
 * A utility type for the initial Gelato transaction object passed to the tracker.
 */
type InitialGelatoTx = Pick<Transaction<TransactionTracker>, 'txKey'> & {
  pending?: boolean;
};

/**
 * Defines the parameters required for the low-level `gelatoTracker` function.
 */
export type GelatoTrackerParams = Pick<
  InitializePollingTracker<GelatoTaskStatusResponse, InitialGelatoTx, TransactionTracker>,
  | 'tx'
  | 'removeTxFromPool'
  | 'onInitialize'
  | 'onSucceed'
  | 'onFailed'
  | 'onIntervalTick'
  | 'pollingInterval'
  | 'retryCount'
>;

/**
 * Checks if a Gelato task state is considered pending.
 * @param {GelatoTaskState} [gelatoStatus] - The current status of the Gelato task.
 * @returns {boolean} True if the status is pending.
 */
function isGelatoTxPending(gelatoStatus?: GelatoTaskState): boolean {
  if (!gelatoStatus) return true;
  const pendingStates = [
    GelatoTaskState.CheckPending,
    GelatoTaskState.ExecPending,
    GelatoTaskState.WaitingForConfirmation,
  ];
  return pendingStates.includes(gelatoStatus);
}

/**
 * A set of terminal states that indicate a transaction has failed or been cancelled.
 */
const GELATO_TERMINAL_FAILURE_STATES = [GelatoTaskState.ExecReverted, GelatoTaskState.Cancelled];

/**
 * The fetcher function passed to `initializePollingTracker` to get the status of a Gelato task.
 * @param {object} params - The parameters for fetching the transaction status.
 * @returns {Promise<Response>} The raw response from the fetch call.
 */
export async function fetchTxFromGelatoAPI({
  tx,
  onSucceed,
  onFailed,
  onIntervalTick,
  clearWatch,
}: {
  clearWatch: (withoutRemoving?: boolean) => void;
} & Pick<GelatoTrackerParams, 'onIntervalTick' | 'onSucceed' | 'onFailed' | 'tx'>): Promise<Response> {
  const response = await fetch(`https://api.gelato.digital/tasks/status/${tx.txKey}/`);

  if (response.ok) {
    const gelatoStatus = (await response.json()) as GelatoTaskStatusResponse;
    const isPending = isGelatoTxPending(gelatoStatus.task.taskState);

    // Safeguard: Stop polling for transactions that have been pending for over a day.
    if (gelatoStatus.task.creationDate) {
      const gelatoCreatedDate = dayjs(gelatoStatus.task.creationDate);
      if (dayjs().diff(gelatoCreatedDate, 'day') >= 1 && isPending) {
        clearWatch(); // Stop polling but don't remove from pool
        return response;
      }
    }

    onIntervalTick?.(gelatoStatus);

    if (!isPending) {
      clearWatch(true); // Stop polling but keep the transaction for UI feedback
      if (gelatoStatus.task.taskState === GelatoTaskState.ExecSuccess) {
        onSucceed(gelatoStatus);
      } else if (GELATO_TERMINAL_FAILURE_STATES.includes(gelatoStatus.task.taskState)) {
        onFailed(gelatoStatus);
      }
    }
  }

  return response;
}

/**
 * A low-level tracker for monitoring Gelato transactions. It wraps the generic polling
 * tracker with the Gelato-specific fetcher logic.
 *
 * @param {GelatoTrackerParams} params - The configuration object for the tracker.
 * @returns {Promise<void>}
 */
export async function gelatoTracker(params: GelatoTrackerParams): Promise<void> {
  await initializePollingTracker({
    ...params,
    fetcher: fetchTxFromGelatoAPI,
  });
}

/**
 * A higher-level wrapper for `gelatoTracker` that integrates directly with the Zustand store.
 * It provides the necessary callbacks to update the transaction's state in the store.
 *
 * @template T - The application-specific transaction union type.
 */
export async function gelatoTrackerForStore<T extends Transaction<TransactionTracker>>({
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
  return await gelatoTracker({
    tx,
    removeTxFromPool,
    onSucceed: async (response) => {
      updateTxParams({
        txKey: tx.txKey,
        status: TransactionStatus.Success,
        pending: false,
        hash: response.task.transactionHash,
        finishedTimestamp: response.task.executionDate ? dayjs(response.task.executionDate).unix() : undefined,
      });

      const updatedTx = transactionsPool[tx.txKey];
      if (onSucceedCallbacks && updatedTx) {
        onSucceedCallbacks(updatedTx);
      }
    },
    onIntervalTick: async (response) => {
      const isPending = isGelatoTxPending(response.task.taskState);
      const isSuccess = response.task.taskState === GelatoTaskState.ExecSuccess;

      updateTxParams({
        txKey: tx.txKey,
        pending: isPending,
        status: isSuccess ? TransactionStatus.Success : isPending ? undefined : TransactionStatus.Failed,
        hash: response.task.transactionHash,
        finishedTimestamp: response.task.executionDate ? dayjs(response.task.executionDate).unix() : undefined,
        errorMessage: GELATO_TERMINAL_FAILURE_STATES.includes(response.task.taskState)
          ? response.task.lastCheckMessage
          : undefined,
        isError: !isPending && !isSuccess,
      });
    },
    onFailed: (response) => {
      updateTxParams({
        txKey: tx.txKey,
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        hash: response.task.transactionHash,
        errorMessage: response.task.lastCheckMessage,
        finishedTimestamp: response.task.executionDate ? dayjs(response.task.executionDate).unix() : undefined,
      });
    },
  });
}
