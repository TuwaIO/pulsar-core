/**
 * @file The tracker for Solana transactions. It polls the `getSignatureStatuses` and `getTransaction` RPC methods
 * through `@solana/kit` until the transaction is finalized or fails.
 */

import type { Signature, TransactionError } from '@solana/kit';
import { normalizeError, OrbitAdapter } from '@tuwaio/orbit-core';
import { createSolanaRPC, getCluster } from '@tuwaio/orbit-solana';
import {
  createTxUpdater,
  initializePollingTracker,
  ITxTrackingStore,
  PollingFetcherParams,
  SolanaTransaction,
  TrackerCallbacks,
  Transaction,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';

/**
 * The status of a Solana transaction that {@link solanaFetcher} reports: the signature status combined with details
 * from `getTransaction`.
 */
export type SolanaSignatureStatusResponse = {
  /** The slot in which the transaction was processed. */
  slot: number;
  /** The number of confirmations (0 once the transaction is rooted). */
  confirmations: number | null;
  /** The on-chain error of a failed transaction, or `null`. */
  err: TransactionError | null;
  /** The commitment level the transaction has reached. */
  confirmationStatus: 'processed' | 'confirmed' | 'finalized' | null;
  /** The transaction fee, in lamports. */
  fee?: number;
  /** The blockhash the transaction was signed with. */
  recentBlockhash?: string;
  /** The instructions of the transaction. */
  instructions?: unknown[];
};

/**
 * The transaction fields {@link solanaFetcher} reads: `adapter` (must be `OrbitAdapter.SOLANA`), the signature as
 * `txKey`, `rpcUrl` or the cluster in `chainId`, `localTimestamp`, and the details it already knows, if any.
 */
export type SolanaFetcherTx = Pick<Transaction, 'adapter' | 'txKey' | 'chainId' | 'localTimestamp' | 'rpcUrl'> &
  Pick<SolanaTransaction, 'fee' | 'recentBlockhash' | 'instructions'>;

/** Unconfirmed transactions stop being tracked after this many hours. */
const MAX_PENDING_HOURS = 1;

/**
 * Transaction details already fetched with `getTransaction`, by tracked transaction object. `initializePollingTracker`
 * passes the same object on every tick, so the details are fetched once per tracking run; entries are released with
 * the object.
 */
const transactionDetailsCache = new WeakMap<
  object,
  Pick<SolanaFetcherTx, 'fee' | 'recentBlockhash' | 'instructions'>
>();

/**
 * A fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that checks a Solana transaction once.
 *
 * It sends `getSignatureStatuses` (with `searchTransactionHistory`, so transactions older than the node's recent status
 * cache are found after a page reload) to `tx.rpcUrl`, or to the public endpoint of the cluster in `tx.chainId`,
 * through a client cached by `createSolanaRPC` from `@tuwaio/orbit-solana`. Until it has the fee, blockhash and
 * instructions (from `tx`, or fetched on an earlier tick of the same tracking run and cached in memory for the `tx`
 * object), it also sends `getTransaction` (commitment `confirmed`).
 *
 * - Signature not found: keeps polling; one hour after `localTimestamp` calls `onFailure()` and stops polling.
 * - Found but `getTransaction` returns nothing yet: reports nothing this tick.
 * - Otherwise calls `onIntervalTick` with the status, then: an on-chain error calls `onFailure` with it; `finalized`
 *   calls `onSuccess`. A transaction not finalized one hour after `localTimestamp` calls `onFailure` with its status.
 *
 * Every terminal outcome stops polling with `withoutRemoving: true`, so the transaction is never removed.
 * - RPC errors are thrown, so the polling tracker retries and gives up after `maxRetries` consecutive errors.
 *
 * @param params - The fetcher parameters provided by `initializePollingTracker`.
 * @returns A promise that resolves when the check is done.
 * @throws `Error` when `tx.adapter` is not `OrbitAdapter.SOLANA`, and any RPC error.
 *
 * @example
 * ```ts
 * import { OrbitAdapter } from '@tuwaio/orbit-core';
 * import { initializePollingTracker } from '@tuwaio/pulsar-core';
 * import { solanaFetcher } from '@tuwaio/pulsar-solana';
 *
 * initializePollingTracker({
 *   tx: { adapter: OrbitAdapter.SOLANA, txKey: signature, chainId: 'solana:devnet', localTimestamp: now, pending: true },
 *   fetcher: solanaFetcher,
 *   onSuccess: (status) => console.log('Finalized in slot', status.slot),
 *   onFailure: (status) => console.error('Failed', status?.err),
 * });
 * ```
 */
export async function solanaFetcher({
  tx,
  stopPolling,
  onSuccess,
  onFailure,
  onIntervalTick,
}: PollingFetcherParams<SolanaSignatureStatusResponse, SolanaFetcherTx>): Promise<void> {
  // Validate that the transaction uses the Solana adapter
  if (tx.adapter !== OrbitAdapter.SOLANA) {
    throw new Error('Tx adapter is not Solana. Please set the adapter to "solana" in the transaction object.');
  }

  // RPC errors are not caught here: they propagate to `initializePollingTracker`, which retries the next tick
  // and gives up only after `maxRetries` consecutive failures.

  // Initialize the Solana RPC client
  const rpc = createSolanaRPC({ rpcUrlOrMoniker: tx.rpcUrl ?? getCluster({ cluster: tx.chainId as string }) });

  const isExpired = dayjs().diff(dayjs.unix(tx.localTimestamp), 'hour') >= MAX_PENDING_HOURS;

  // Fetch transaction signature status. `searchTransactionHistory` also finds transactions that already left the
  // node's recent status cache, e.g. when tracking resumes after a page reload.
  const statuses = await rpc.getSignatureStatuses([tx.txKey as Signature], { searchTransactionHistory: true }).send();
  const status = statuses?.value?.[0];

  // The signature is unknown to the cluster: keep waiting, or give up once the transaction is too old to land.
  if (!status) {
    if (isExpired) {
      onFailure();
      stopPolling({ withoutRemoving: true });
    }
    return;
  }

  // Use the details the transaction already has, or the ones fetched on an earlier tick; fetch them only once.
  let details =
    tx.fee !== undefined && tx.recentBlockhash !== undefined && tx.instructions !== undefined
      ? { fee: tx.fee, recentBlockhash: tx.recentBlockhash, instructions: tx.instructions }
      : transactionDetailsCache.get(tx);

  if (!details) {
    const txDetails = await rpc
      .getTransaction(tx.txKey as Signature, { encoding: 'json', maxSupportedTransactionVersion: 0 })
      .send();
    const { meta, transaction } = txDetails || {};

    // If no transaction details are found, skip further processing
    if (!meta || !transaction) {
      return;
    }

    // Extract details from RPC response
    details = {
      fee: Number(meta.fee ?? 0),
      recentBlockhash: transaction.message.recentBlockhash?.toString(),
      instructions: transaction.message.instructions as unknown[],
    };
    transactionDetailsCache.set(tx, details);
  }
  const { fee, recentBlockhash, instructions } = details;

  // Construct the extended transaction status object
  const typedStatus: SolanaSignatureStatusResponse = {
    ...status,
    slot: Number(status.slot),
    confirmations: Number(status.confirmations ?? 0),
    fee,
    recentBlockhash,
    instructions,
  };

  // Trigger periodic updates for transaction tracking
  onIntervalTick?.(typedStatus);

  // Handle transaction error state
  if (typedStatus.err) {
    onFailure(typedStatus);
    stopPolling({ withoutRemoving: true });
    return;
  }

  // Handle finalized transaction state
  if (typedStatus.confirmationStatus === 'finalized') {
    onSuccess(typedStatus);
    stopPolling({ withoutRemoving: true });
    return;
  }

  // Give up if the transaction is still not finalized one hour after it was sent
  if (isExpired) {
    onFailure(typedStatus);
    stopPolling({ withoutRemoving: true });
  }
}

/**
 * Tracks a Solana transaction of the Pulsar store with {@link solanaFetcher} (every 2.5 s, up to 10 consecutive RPC
 * errors) and writes the results to the store: `confirmations`, `slot`, `fee`, `instructions` and `recentBlockhash`
 * while pending, then `Success` with `confirmations: 'MAX'`, or `Failed` with the normalized error, and the local time
 * as `finishedTimestamp`.
 *
 * When tracking gives up (10 consecutive RPC errors, or not finalized one hour after `localTimestamp`), the transaction
 * is marked `Failed` and stays in the pool. The callbacks receive the transaction with every update written by the
 * tracker; `onError` receives the on-chain error, or an `Error` when tracking timed out.
 *
 * @template T - The application transaction type.
 * @param params - The transaction, the store members and the callbacks.
 * @param params.tx - The Solana transaction to track.
 * @param params.updateTxParams - The store's `updateTxParams`.
 * @param params.removeTxFromPool - Not used: failed transactions stay in the pool.
 * @param params.transactionsPool - The store's pool when tracking starts.
 * @param params.onSuccess - Called when the transaction is finalized.
 * @param params.onError - Called when the transaction failed or tracking gave up.
 * @returns A promise that resolves once polling has started.
 */
export async function solanaTrackerForStore<T extends Transaction>({
  tx,
  onSuccess,
  onError,
  ...rest
}: Pick<ITxTrackingStore<T>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'> & {
  tx: T;
} & TrackerCallbacks<T>): Promise<void> {
  const updateTx = createTxUpdater({
    tx,
    transactionsPool: rest.transactionsPool,
    updateTxParams: rest.updateTxParams,
  });

  return initializePollingTracker<SolanaSignatureStatusResponse, T>({
    tx,
    fetcher: solanaFetcher,
    // `removeTxFromPool` is not passed: failed transactions stay in the pool as `Failed`.
    pollingInterval: 2500, // Polling interval: 2.5 seconds
    maxRetries: 10, // Max retries: 10 times

    // Writes the finalized transaction details.
    onSuccess: (response) => {
      const updatedTx = updateTx({
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
        finishedTimestamp: dayjs().unix(),
        fee: response.fee,
        instructions: response.instructions,
        recentBlockhash: response.recentBlockhash,
        confirmations: 'MAX',
        slot: response.slot,
      });

      // Trigger global success callbacks, if applicable
      if (onSuccess && updatedTx) {
        onSuccess(updatedTx);
      }
    },

    // Writes intermediate details while the transaction is pending.
    onIntervalTick: (response) => {
      updateTx({
        confirmations: response.confirmations ?? 0,
        slot: response.slot,
        fee: response.fee,
        instructions: response.instructions,
        recentBlockhash: response.recentBlockhash,
      });
    },

    // Marks the transaction failed (on-chain error, timeout or too many RPC errors).
    onFailure: (response) => {
      const updatedTx = updateTx({
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        error: normalizeError(
          response?.err ?? new Error('Transaction tracking timed out or the transaction was not found.'),
        ),
        finishedTimestamp: dayjs().unix(),
      });

      // Call user onError callback
      if (onError && updatedTx) {
        onError(
          response?.err ?? new Error('Transaction tracking timed out or the transaction was not found.'),
          updatedTx,
        );
      }
    },
  });
}
