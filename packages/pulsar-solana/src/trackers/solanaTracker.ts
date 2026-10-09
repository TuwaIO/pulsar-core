/**
 * @file The tracker for Solana transactions. It polls the `getSignatureStatuses`, `getTransaction` and
 * `getBlockHeight` RPC methods through `@solana/kit` until the transaction is finalized, fails or expires.
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

import { peekSolanaTxLifetime, takeSolanaTxLifetime } from '../utils/solanaTxLifetimes';

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
  /**
   * `true` when the signature is still unknown and the chain has passed the `lastValidBlockHeight` of the transaction:
   * its blockhash expired and it can no longer land.
   */
  expired?: boolean;
};

/**
 * The transaction fields {@link solanaFetcher} reads: `adapter` (must be `OrbitAdapter.SOLANA`), the signature as
 * `txKey`, `rpcUrl` or the cluster in `chainId`, `localTimestamp`, and the details it already knows, if any.
 */
export type SolanaFetcherTx = Pick<Transaction, 'adapter' | 'txKey' | 'chainId' | 'localTimestamp' | 'rpcUrl'> &
  Pick<SolanaTransaction, 'fee' | 'recentBlockhash' | 'instructions' | 'lastValidBlockHeight'>;

/** The error of a transaction whose blockhash expired before it landed. */
const EXPIRED_ERROR_MESSAGE =
  'The transaction expired before it landed: its blockhash is no longer valid. It was not executed; send it again.';

/** The error of a transaction that was not found or not finalized in time. */
const TIMEOUT_ERROR_MESSAGE = 'Transaction tracking timed out or the transaction was not found.';

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
 * - Signature not found, with `tx.lastValidBlockHeight` (or the one `signAndSendSolanaTx` recorded for the signature
 *   in this page): sends `getBlockHeight` (commitment `confirmed`); once the
 *   height is above it, checks the signature once more and, still not found, calls `onFailure` with `expired: true`
 *   and stops polling (the blockhash expired, so the transaction can never land).
 * - Signature not found otherwise: keeps polling; one hour after `localTimestamp` calls `onFailure()` and stops
 *   polling.
 * - Found: calls `onIntervalTick` with the status (`confirmationStatus` `processed`, `confirmed` or `finalized`, plus
 *   the details once `getTransaction` returns them), then: an on-chain error calls `onFailure` with it right away;
 *   `finalized` with the details calls `onSuccess`. A transaction not finalized one hour after `localTimestamp` calls
 *   `onFailure` with its status.
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
 * import { OrbitAdapter, SOLANA_CHAIN_IDS } from '@tuwaio/orbit-core';
 * import { initializePollingTracker } from '@tuwaio/pulsar-core';
 * import { solanaFetcher } from '@tuwaio/pulsar-solana';
 *
 * initializePollingTracker({
 *   tx: { adapter: OrbitAdapter.SOLANA, txKey: signature, chainId: SOLANA_CHAIN_IDS.devnet, localTimestamp: now, pending: true },
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
  const fetchStatus = async () =>
    (await rpc.getSignatureStatuses([tx.txKey as Signature], { searchTransactionHistory: true }).send())?.value?.[0];
  let status = await fetchStatus();

  // The signature is unknown and its blockhash may have expired: once the chain is past its last valid block height,
  // check the signature once more (it may have landed in the last valid blocks), then give up for good.
  const lastValidBlockHeight = tx.lastValidBlockHeight ?? peekSolanaTxLifetime(tx.txKey);
  if (!status && lastValidBlockHeight !== undefined) {
    const blockHeight = await rpc.getBlockHeight({ commitment: 'confirmed' }).send();
    if (BigInt(blockHeight) > BigInt(lastValidBlockHeight)) {
      status = await fetchStatus();
      if (!status) {
        onFailure({ slot: 0, confirmations: null, err: null, confirmationStatus: null, expired: true });
        stopPolling({ withoutRemoving: true });
        return;
      }
    }
  }

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
      .getTransaction(tx.txKey as Signature, {
        commitment: 'confirmed',
        encoding: 'json',
        maxSupportedTransactionVersion: 0,
      })
      .send();
    const { meta, transaction } = txDetails || {};

    // The details become available shortly after the status: report the status alone until then.
    if (meta && transaction) {
      details = {
        fee: Number(meta.fee ?? 0),
        recentBlockhash: transaction.message.recentBlockhash?.toString(),
        instructions: transaction.message.instructions as unknown[],
      };
      transactionDetailsCache.set(tx, details);
    }
  }

  // Construct the extended transaction status object
  const typedStatus: SolanaSignatureStatusResponse = {
    ...status,
    slot: Number(status.slot),
    confirmations: Number(status.confirmations ?? 0),
    ...details,
  };

  // Trigger periodic updates for transaction tracking
  onIntervalTick?.(typedStatus);

  // Handle transaction error state: an executed transaction with an error is final, with or without its details.
  if (typedStatus.err) {
    onFailure(typedStatus);
    stopPolling({ withoutRemoving: true });
    return;
  }

  // Handle finalized transaction state (the success carries the details)
  if (typedStatus.confirmationStatus === 'finalized' && details) {
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
 * Tracks a Solana transaction of the Pulsar store with {@link solanaFetcher} (every second, up to 30 consecutive RPC
 * errors) and writes the results to the store: `confirmationStatus` (`processed`, then `confirmed`, usually within a
 * second of sending), `confirmations`, `slot`, `fee`, `instructions` and `recentBlockhash` while pending, then
 * `Success` with `confirmationStatus: 'finalized'` and `confirmations: 'MAX'`, or `Failed` with the normalized error,
 * and the local time as `finishedTimestamp`.
 *
 * A transaction sent with `signAndSendSolanaTx` gets the last valid block height of its blockhash, saved as
 * `lastValidBlockHeight`: when the chain passes it without the transaction, it is marked `Failed` with an "expired"
 * error, within seconds instead of an hour.
 *
 * When tracking gives up (30 consecutive RPC errors, or not finalized one hour after `localTimestamp`), the transaction
 * is marked `Failed` and stays in the pool. The callbacks receive the transaction with every update written by the
 * tracker; `onError` receives the on-chain error, or an `Error` when the transaction expired or tracking timed out.
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

  // Save the blockhash lifetime recorded by `signAndSendSolanaTx`, so it survives reloads and the fetcher can use it.
  let trackedTx = tx;
  const lastValidBlockHeight = takeSolanaTxLifetime(tx.txKey);
  if (lastValidBlockHeight !== undefined && (tx as SolanaFetcherTx).lastValidBlockHeight === undefined) {
    rest.updateTxParams(tx.txKey, { lastValidBlockHeight });
    trackedTx = { ...tx, lastValidBlockHeight };
  }

  return initializePollingTracker<SolanaSignatureStatusResponse, T>({
    tx: trackedTx,
    fetcher: solanaFetcher,
    // `removeTxFromPool` is not passed: failed transactions stay in the pool as `Failed`.
    pollingInterval: 1000, // Polling interval: 1 second, so `confirmed` shows up quickly
    maxRetries: 30, // Max consecutive RPC errors: 30 (about 30 seconds of outage)

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
        confirmationStatus: 'finalized',
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
        confirmationStatus: response.confirmationStatus ?? undefined,
        fee: response.fee,
        instructions: response.instructions,
        recentBlockhash: response.recentBlockhash,
      });
    },

    // Marks the transaction failed (on-chain error, expired blockhash, timeout or too many RPC errors).
    onFailure: (response) => {
      const reason = response?.err ?? new Error(response?.expired ? EXPIRED_ERROR_MESSAGE : TIMEOUT_ERROR_MESSAGE);
      const updatedTx = updateTx({
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        error: normalizeError(reason),
        finishedTimestamp: dayjs().unix(),
      });

      // Call user onError callback
      if (onError && updatedTx) {
        onError(reason, updatedTx);
      }
    },
  });
}
