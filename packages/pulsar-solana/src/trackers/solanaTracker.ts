/**
 * @file Implements the transaction tracking logic for standard Solana transactions.
 * It uses a polling mechanism to query the `getSignatureStatuses` RPC method.
 */

import { createSolanaRpc, Rpc, Signature, SolanaRpcApi, TransactionError } from '@solana/kit';
import {
  initializePollingTracker,
  ITxTrackingStore,
  PollingTrackerConfig,
  Transaction,
  TransactionAdapter,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';

import { SolanaActionTxKey, SolanaTransactionTracker } from '../types';

// --- RPC Client Caching ---

/**
 * An in-memory cache for RPC clients to avoid re-creating them on every poll.
 * @internal
 */
const rpcCache = new Map<string, Rpc<SolanaRpcApi>>();

/**
 * Retrieves a cached RPC client for a given URL or creates a new one.
 * @param rpcUrl - The RPC endpoint URL.
 * @returns The RPC client instance.
 * @internal
 */
const getRpcClient = (rpcUrl: string): Rpc<SolanaRpcApi> => {
  if (rpcCache.has(rpcUrl)) {
    return rpcCache.get(rpcUrl)!;
  }
  const newRpc = createSolanaRpc(rpcUrl);
  rpcCache.set(rpcUrl, newRpc);
  return newRpc;
};

// --- Types ---

/**
 * The shape of the status object returned for each signature from `getSignatureStatuses`.
 * @internal
 */
type SolanaSignatureStatusResponse = {
  slot: bigint;
  confirmations: number | null;
  err: TransactionError | null;
  confirmationStatus: 'processed' | 'confirmed' | 'finalized' | null;
};

/**
 * The parameters for our specific fetcher function.
 * @internal
 */
type SolanaFetcherParams = Parameters<
  PollingTrackerConfig<
    SolanaSignatureStatusResponse,
    Transaction<SolanaTransactionTracker>,
    SolanaTransactionTracker
  >['fetcher']
>[0];

// --- Fetcher Implementation ---

/**
 * A reusable fetcher for `initializePollingTracker` that queries the Solana RPC for a transaction's signature status.
 * This is the core polling logic that powers the tracker.
 */
export async function solanaFetcher({ tx, stopPolling, onSuccess, onFailure, onIntervalTick }: SolanaFetcherParams) {
  if (tx.adapter !== TransactionAdapter.SOLANA || !tx.rpcUrl) {
    // This should not happen if the types are correct, but it's a good runtime safeguard.
    throw new Error('RPC URL is missing from the Solana transaction.');
  }

  const rpc = getRpcClient(tx.rpcUrl);
  const statuses = await rpc.getSignatureStatuses([tx.txKey as Signature]).send();
  const status = statuses?.value[0];

  if (!status) {
    // Continue polling if the transaction is not yet found by the RPC node.
    // The polling tracker will handle the retry delay.
    return;
  }

  const typedStatus = status as SolanaSignatureStatusResponse;
  onIntervalTick?.(typedStatus);

  if (typedStatus.err) {
    onFailure(typedStatus); // Terminal failure state
    return;
  }

  if (typedStatus.confirmationStatus === 'finalized') {
    onSuccess(typedStatus); // Terminal success state
  }

  // Safeguard: Stop polling for very old pending transactions.
  if (dayjs().diff(dayjs.unix(tx.localTimestamp), 'minute') >= 30) {
    stopPolling({ withoutRemoving: true });
    // When a timeout occurs, we call `onFailure` with the last known status,
    // but the tracker itself will provide the specific timeout error message.
    onFailure(typedStatus);
  }
}

// --- Store-Connected Tracker ---

/**
 * A higher-level wrapper that integrates the Solana polling logic with the Pulsar store.
 * It uses the generic `solanaFetcher` and provides store-specific callbacks.
 *
 * @template T - The application-specific transaction type, constrained to Transaction.
 */
export async function solanaTrackerForStore<T extends Transaction<SolanaTransactionTracker>>({
  tx,
  ...rest
}: Pick<
  ITxTrackingStore<SolanaTransactionTracker, T, SolanaActionTxKey>,
  'transactionsPool' | 'updateTxParams' | 'onSucceedCallbacks' | 'removeTxFromPool'
> & {
  tx: T;
}) {
  return initializePollingTracker<SolanaSignatureStatusResponse, T, SolanaTransactionTracker>({
    tx,
    fetcher: solanaFetcher,
    removeTxFromPool: rest.removeTxFromPool,
    pollingInterval: 2500,
    maxRetries: 720, // 30 minutes timeout (720 intervals * 2.5s = 1800s)
    onSuccess: (response) => {
      rest.updateTxParams(tx.txKey, {
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
        finishedTimestamp: dayjs().unix(),
        confirmations: response.confirmations ?? 1,
        slot: Number(response.slot),
      });

      const updatedTx = rest.transactionsPool[tx.txKey];
      if (rest.onSucceedCallbacks && updatedTx) {
        rest.onSucceedCallbacks(updatedTx);
      }
    },
    onIntervalTick: (response) => {
      rest.updateTxParams(tx.txKey, {
        confirmations: response.confirmations ?? 0,
        slot: Number(response.slot),
      });
    },
    onFailure: (response) => {
      // If `response` is undefined, it means the polling timed out from `initializePollingTracker`.
      // Otherwise, the transaction failed on-chain.
      const errorMessage = response?.err
        ? `Transaction failed: ${JSON.stringify(response.err)}`
        : 'Transaction tracking timed out or the transaction was not found.';

      rest.updateTxParams(tx.txKey, {
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        errorMessage,
        finishedTimestamp: dayjs().unix(),
      });
    },
  });
}
