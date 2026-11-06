/**
 * @file The tracker for Solana transactions. It polls the `getSignatureStatuses`, `getTransaction` and
 * `getBlockHeight` RPC methods through `@solana/kit` until the transaction is finalized, fails or expires.
 */

import type { Signature, TransactionError } from '@solana/kit';
import { normalizeError, OrbitAdapter } from '@tuwaio/orbit-core';
import { createSolanaRPC, getCluster } from '@tuwaio/orbit-solana';
import {
  createAbandonCheck,
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
 * from `getTransaction`. The details (`fee`, `recentBlockhash`, `instructions`) are missing until `getTransaction`
 * returns them, and in a success reported without them.
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
export type SolanaFetcherTx = Pick<Transaction, 'adapter' | 'txKey' | 'chainId' | 'localTimestamp'> &
  Pick<SolanaTransaction, 'fee' | 'recentBlockhash' | 'instructions' | 'lastValidBlockHeight'> & {
    /** The RPC endpoint to read. Without it, the public endpoint of the cluster in `chainId`. */
    rpcUrl?: string;
  };

/** The error of a transaction whose blockhash expired before it landed. */
const EXPIRED_ERROR_MESSAGE =
  'The transaction expired before it landed: its blockhash is no longer valid. It was not executed; send it again.';

/** The error of a transaction that was not found or not finalized in time. */
const TIMEOUT_ERROR_MESSAGE = 'Transaction tracking timed out or the transaction was not found.';

/**
 * What a person reads for an error on the chain. It is no `Error`, so `normalizeError` alone says "Unknown error" and
 * keeps the code where only a developer looks. `@solana/kit` hands its numbers over as bigints, which
 * JSON refuses; an instruction index and a program's error code are small.
 */
const onChainErrorMessage = (err: unknown): string =>
  `The transaction failed on the chain: ${
    typeof err === 'string'
      ? err
      : JSON.stringify(err, (_key, value: unknown) => (typeof value === 'bigint' ? Number(value) : value))
  }`;

/**
 * How far past `lastValidBlockHeight` the chain must be before a signature nobody shows counts as expired: about what a block needs
 * to become final. By then a transaction of the last valid block is final and any healthy node shows it, where one read of a node
 * a little behind told of one that had landed "send it again". It delays only the failure, by some 13 seconds.
 */
const EXPIRY_MARGIN_BLOCKS = 32n;

/** No blockhash lives longer. Past this a signature can only be found in the history, which costs a node more. */
const BLOCKHASH_LIFETIME_SECONDS = 90;

/** Tracked transaction objects this run has read at least once, and those it saw with a blockhash still valid. */
const checkedInThisRun = new WeakSet<object>();
const seenStillValid = new WeakSet<object>();

/** How long the tracker reads every second, and how often after that. */
const FAST_POLLING_SECONDS = 120;
const SLOW_POLLING_MS = 15_000;

/** Unconfirmed transactions stop being tracked after this many hours. */
const MAX_PENDING_HOURS = 1;

/** On this check, a finalized transaction whose details are still missing succeeds without them. */
const MAX_FINALIZED_CHECKS_WITHOUT_DETAILS = 10;

/**
 * Transaction details already fetched with `getTransaction`, by tracked transaction object. `initializePollingTracker`
 * passes the same object on every tick, so the details are fetched once per tracking run; entries are released with
 * the object.
 */
const transactionDetailsCache = new WeakMap<
  object,
  Pick<SolanaFetcherTx, 'fee' | 'recentBlockhash' | 'instructions'>
>();

/** The number of checks that found the transaction finalized but without its details, by tracked transaction object. */
const finalizedChecksWithoutDetails = new WeakMap<object, number>();

/**
 * A fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that checks a Solana transaction once.
 *
 * It sends `getSignatureStatuses` (with `searchTransactionHistory` on the first check of a run and past a blockhash's lifetime, so
 * transactions older than the node's recent status cache are found after a page reload) to `tx.rpcUrl`, or to the public endpoint of the cluster in `tx.chainId`,
 * through a client cached by `createSolanaRPC` from `@tuwaio/orbit-solana`. Until it has the fee, blockhash and
 * instructions (from `tx`, or fetched on an earlier tick of the same tracking run and cached in memory for the `tx`
 * object), it also sends `getTransaction` (commitment `confirmed`, `maxSupportedTransactionVersion: 1`, so legacy,
 * version 0 and version 1 transactions are read). A `getTransaction` error is not thrown: the check goes on with the
 * status alone and the details are asked again on the next tick.
 *
 * - Signature not found, with `tx.lastValidBlockHeight` (or the one `signAndSendSolanaTx` recorded for the signature
 *   in this page): sends `getBlockHeight` (commitment `confirmed`); once the height is more than 32 blocks above it, checks the
 *   signature once more and, still not found, calls `onFailure` and stops polling, with `expired: true` when this run saw the
 *   blockhash still valid (it can never land), `false` when it came back later and the node may just keep no old statuses.
 * - Signature not found otherwise: keeps polling; one hour after `localTimestamp` calls `onFailure()` and stops
 *   polling.
 * - Found: calls `onIntervalTick` with the status (`confirmationStatus` `processed`, `confirmed` or `finalized`, plus
 *   the details once `getTransaction` returns them), then: an on-chain error past `processed` calls `onFailure` with it right away;
 *   `finalized` with the details calls `onSuccess`. `finalized` without the details keeps polling for them and, on
 *   the 10th such check of the `tx` object (counted in memory), logs a warning and calls `onSuccess` without them. A
 *   transaction not finalized one hour after `localTimestamp` calls `onFailure` with its status; a finalized one never
 *   does.
 *
 * Every terminal outcome stops polling with `withoutRemoving: true`, so the transaction is never removed.
 * - Errors of `getSignatureStatuses` and `getBlockHeight` are thrown, so the polling tracker retries and gives up after
 *   `maxRetries` consecutive errors.
 *
 * @param params - The fetcher parameters provided by `initializePollingTracker`.
 * @returns A promise that resolves when the check is done.
 * @throws `Error` when `tx.adapter` is not `OrbitAdapter.SOLANA`, and any error of `getSignatureStatuses` or
 * `getBlockHeight`.
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

  // Status and block height errors are not caught here: they propagate to `initializePollingTracker`, which retries
  // the next tick and gives up only after `maxRetries` consecutive failures.

  // Initialize the Solana RPC client
  const rpc = createSolanaRPC({ rpcUrlOrMoniker: tx.rpcUrl ?? getCluster({ cluster: tx.chainId as string }) });

  const isExpired = dayjs().diff(dayjs.unix(tx.localTimestamp), 'hour') >= MAX_PENDING_HOURS;

  // Fetch transaction signature status. `searchTransactionHistory` also finds transactions that already left the
  // node's recent status cache, e.g. when tracking resumes after a page reload.
  const fetchStatus = async (searchTransactionHistory: boolean) =>
    (
      await rpc
        .getSignatureStatuses([tx.txKey as Signature], searchTransactionHistory ? { searchTransactionHistory } : {})
        .send()
    )?.value?.[0];
  // Every second for a recent transaction it asked more of a node than the status cache can answer anyway
  const recentlySent = dayjs().diff(dayjs.unix(tx.localTimestamp), 'second') < BLOCKHASH_LIFETIME_SECONDS;
  let status = await fetchStatus(!checkedInThisRun.has(tx) || !recentlySent);
  checkedInThisRun.add(tx);

  // The signature is unknown and its blockhash may have expired: once the chain is past its last valid block height,
  // check the signature once more (it may have landed in the last valid blocks), then give up for good.
  const lastValidBlockHeight = tx.lastValidBlockHeight ?? peekSolanaTxLifetime(tx.txKey);
  if (!status && lastValidBlockHeight !== undefined) {
    const blockHeight = await rpc.getBlockHeight({ commitment: 'confirmed' }).send();
    if (BigInt(blockHeight) <= BigInt(lastValidBlockHeight) + EXPIRY_MARGIN_BLOCKS) {
      seenStillValid.add(tx);
    } else {
      status = await fetchStatus(true);
      if (!status) {
        // "It was not executed" is for a run that saw the blockhash run out. Coming back long after, on a node that may keep no old
        // statuses, silence proves nothing, and those words would make someone pay again
        onFailure({
          slot: 0,
          confirmations: null,
          err: null,
          confirmationStatus: null,
          expired: seenStillValid.has(tx),
        });
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

  // The details are optional: a `getTransaction` error (e.g. a transaction version newer than the one requested) must
  // neither hide the status nor fail the transaction, so it is caught and the status is reported alone.
  let detailsError: unknown;
  if (!details) {
    try {
      const txDetails = await rpc
        .getTransaction(tx.txKey as Signature, {
          commitment: 'confirmed',
          encoding: 'json',
          maxSupportedTransactionVersion: 1,
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
    } catch (error) {
      detailsError = error;
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
  // Not at `processed`: that block may not stay, and the next check, a second later, says `confirmed`
  if (typedStatus.err && typedStatus.confirmationStatus !== 'processed') {
    onFailure(typedStatus);
    stopPolling({ withoutRemoving: true });
    return;
  }

  // Handle finalized transaction state: the success carries the details, or goes without them once they are still
  // missing after a few checks. A finalized transaction never reaches the one-hour timeout below.
  if (typedStatus.confirmationStatus === 'finalized') {
    if (!details) {
      const checksWithoutDetails = (finalizedChecksWithoutDetails.get(tx) ?? 0) + 1;
      if (checksWithoutDetails < MAX_FINALIZED_CHECKS_WITHOUT_DETAILS) {
        finalizedChecksWithoutDetails.set(tx, checksWithoutDetails);
        return;
      }
      console.warn(
        `Solana transaction ${tx.txKey} is finalized, but its details were not fetched in ${MAX_FINALIZED_CHECKS_WITHOUT_DETAILS} checks; reporting success without them.`,
        ...(detailsError === undefined ? [] : [detailsError]),
      );
    }
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
 * Tracks a Solana transaction of the Pulsar store with {@link solanaFetcher} (the first look a second away; then by its age, every second for two minutes, then every 15 seconds, and every minute after 30
 * consecutive status errors) and writes the results to the store: `confirmationStatus` (`processed`, then `confirmed`, usually within a
 * second of sending), `confirmations`, `slot`, `fee`, `instructions` and `recentBlockhash` while pending, then
 * `Success` with `confirmationStatus: 'finalized'` and `confirmations: 'MAX'`, or `Failed` with the normalized error,
 * and the local time as `finishedTimestamp`. The details (`fee`, `instructions`, `recentBlockhash`) are optional: when
 * `getTransaction` fails, the status is still written, and a finalized transaction whose details are still missing
 * after 10 checks is marked `Success` without them.
 *
 * A transaction sent with `signAndSendSolanaTx` gets the last valid block height of its blockhash, saved as
 * `lastValidBlockHeight`: when the chain passes it without the transaction, it is marked `Failed` with an "expired"
 * error, within seconds instead of an hour.
 *
 * An RPC outage says nothing about the transaction, so errors of `getSignatureStatuses` or `getBlockHeight` never end
 * tracking. When it is not finalized one hour after `localTimestamp`, long past any blockhash lifetime, the transaction is
 * marked `Failed` and stays in the pool. The callbacks receive the
 * transaction with every update written by the tracker; `onError` receives the on-chain error, or an `Error` when the
 * transaction expired or tracking timed out. An on-chain error is written with the message
 * `The transaction failed on the chain: ...`, naming the error as the node gave it.
 *
 * @template T - The application transaction type.
 * @param params - The transaction, the store members and the callbacks.
 * @param params.tx - The Solana transaction to track.
 * @param params.rpcUrl - The RPC endpoint of its cluster; without it, the public endpoint of the cluster.
 * @param params.updateTxParams - The store's `updateTxParams`.
 * @param params.removeTxFromPool - Not used: failed transactions stay in the pool.
 * @param params.transactionsPool - The store's pool when tracking starts.
 * @param params.onSuccess - Called when the transaction is finalized.
 * @param params.onError - Called when the transaction failed or tracking gave up.
 * @returns A promise that resolves once polling has started.
 */
export async function solanaTrackerForStore<T extends Transaction>({
  tx,
  rpcUrl,
  onSuccess,
  onError,
  ...rest
}: Pick<ITxTrackingStore<T>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'> &
  Partial<Pick<ITxTrackingStore<T>, 'isTxTracked'>> & {
    tx: T;
    /** The RPC endpoint of its cluster, from the adapter. Not written to the pool: an endpoint can hold a key. */
    rpcUrl?: string;
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
    tx: rpcUrl ? { ...trackedTx, rpcUrl } : trackedTx,
    fetcher: solanaFetcher,
    // `removeTxFromPool` is not passed: failed transactions stay in the pool as `Failed`.
    // Every second while a transaction can still land by its blockhash, so `confirmed` shows up quickly; slower after, as one with no
    // lifetime saved cost 3600 calls an hour for its whole hour
    // The first look stays a second away whatever the age: coming back to a page must not wait out the slow schedule
    pollingInterval: (elapsedMs) =>
      elapsedMs < 1000 || dayjs().diff(dayjs.unix(Number(tx.localTimestamp)), 'second') < FAST_POLLING_SECONDS
        ? 1000
        : SLOW_POLLING_MS,
    maxRetries: 30, // Consecutive RPC errors before it slows down: 30 (about 30 seconds of outage)
    // An RPC outage says nothing about the transaction. The expired blockhash is what ends one that will never land.
    retryForeverEveryMs: 60_000,
    isAbandoned: createAbandonCheck(rest.isTxTracked, tx.txKey),

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
        error: response?.err
          ? { ...normalizeError(reason), message: onChainErrorMessage(response.err) }
          : normalizeError(reason),
        finishedTimestamp: dayjs().unix(),
      });

      // Call user onError callback
      if (onError && updatedTx) {
        onError(reason, updatedTx);
      }
    },
  });
}
