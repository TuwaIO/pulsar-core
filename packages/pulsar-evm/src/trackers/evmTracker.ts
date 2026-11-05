/**
 * @file The tracker for standard EVM transactions. It uses viem actions (`getTransaction`,
 * `waitForTransactionReceipt`, `getTransactionConfirmations`, `getBlock`) through the wagmi client of the chain.
 */

import { createTxUpdater, ITxTrackingStore, TrackerCallbacks, Transaction } from '@tuwaio/pulsar-core';
import { Config, getClient } from '@wagmi/core';
import {
  Client,
  GetTransactionReturnType,
  Hex,
  ReplacementReturnType,
  TransactionReceipt,
  WaitForTransactionReceiptParameters,
  zeroHash,
} from 'viem';
import {
  getBlockNumber,
  getTransaction,
  getTransactionConfirmations,
  getTransactionReceipt,
  waitForTransactionReceipt,
} from 'viem/actions';

import { NonceSlot, NonceSlotScan, NonceSlotSpentError, readNonceSlot } from '../utils/readNonceSlot';
import { storeCallbacks, storeTrackerOptions } from './storeCallbacks';

const DEFAULT_RETRY_COUNT = 10;
const DEFAULT_RETRY_TIMEOUT_MS = 3000;
/** Once `retryCount` lookups found nothing and the tracker may look for longer. */
const NOT_FOUND_SLOW_DELAY_MS = 30_000;
const DEFAULT_RECEIPT_ATTEMPTS = 6;
const RECEIPT_RETRY_DELAY = 5_000; // 5s base delay between attempts
const MAX_RECEIPT_RETRY_DELAY = 30_000;
const CONFIRMATIONS_POLLING_INTERVAL = 5000; // 5s between confirmation checks
/** One call of viem's `waitForTransactionReceipt`: the whole wait of one attempt, not one RPC call. */
const SINGLE_ATTEMPT_TIMEOUT = 60_000;
/** A spent nonce with no transaction to show can be a node behind its load balancer: it must hold for a few readings. */
const SPENT_READINGS_TO_BELIEVE = 3;
/** How far before the block read at the start a replacement is looked for: nodes behind a load balancer disagree. */
const FROM_BLOCK_MARGIN = 5n;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The configuration of {@link evmTracker}.
 */
export type EVMTrackerParams = {
  /**
   * The transaction: its hash (`txKey`), its numeric `chainId` (which must be configured in `config`) and, optionally,
   * the number of confirmations to wait for.
   */
  tx: Pick<Transaction, 'chainId' | 'txKey' | 'requiredConfirmations'>;
  /** The wagmi config; the tracker uses its client for `tx.chainId`. */
  config: Config;
  /**
   * What an earlier run read of this transaction. A node may no longer return a replaced hash, and then only these can
   * tell what became of it, so save them when `onTxDetailsFetched` runs and pass them after a reload or a restart.
   * Use the sender from `getTransaction`: for a relayed transaction it is the relayer, not the wallet.
   */
  knownDetails?: NonceSlot;
  /**
   * Called once with the result of `getTransaction`.
   * @param txDetails - The transaction: nonce, fees, `to`, `value`, `input`.
   */
  onTxDetailsFetched: (txDetails: GetTransactionReturnType) => void;
  /**
   * Called and awaited once the receipt is available and the required confirmations are reached. Also called for
   * reverted transactions: check `receipt.status`.
   * @param txDetails - The result of `getTransaction`, or `undefined` when the node kept failing to return it for a
   * transaction it has a receipt for: the receipt is proof enough.
   * @param receipt - The transaction receipt.
   * @param client - The viem client of the chain, for further RPC calls.
   */
  onSuccess: (
    txDetails: GetTransactionReturnType | undefined,
    receipt: TransactionReceipt,
    client: Client,
  ) => Promise<void>;
  /**
   * Called and awaited when another transaction spent this one's nonce (speed-up, cancel or any other transaction), once
   * that transaction has the required confirmations. An error it throws is logged.
   * @param replacement - viem's replacement data: the `reason` (`repriced`, `cancelled`, `replaced`) and the replacing
   * `transaction` with its receipt.
   */
  onReplaced: (replacement: ReplacementReturnType) => Promise<void> | void;
  /**
   * Called and awaited once when tracking gives up (see {@link evmTracker}).
   * @param error - The last error: {@link NonceSlotSpentError} when the transaction can never land, but what spent its
   * nonce could not be found, so money may have moved.
   */
  onFailure: (error?: unknown) => Promise<void> | void;
  /** Called once, before anything else. */
  onInitialize?: () => void;
  /** Number of `getTransaction` attempts. With `notFoundUntil` it only sets how many are made 3 s apart. Defaults to 10. */
  retryCount?: number;
  /** Delay between `getTransaction` attempts, in milliseconds. Defaults to 3000. */
  retryTimeout?: number;
  /**
   * When to stop looking for a hash the node has never shown, in milliseconds since the epoch. Past `retryCount`
   * attempts it looks every 30 s, and only the node answering that it has no such transaction ends it, not an RPC error.
   * Defaults to stopping after `retryCount` attempts.
   */
  notFoundUntil?: number;
  /**
   * How long to wait for the receipt, as a number of attempts of up to the `timeout` of
   * `waitForTransactionReceiptParams`, with pauses of 5, 10, 15 s and so on, up to 30 s: 6 attempts, the default, are 435 s
   * with the default `timeout`. It is a limit in time: an attempt ended early by an RPC error is only followed by another.
   * Between attempts the tracker reads the nonce of the sender. `Infinity` waits until there is a receipt or a replacement:
   * a slow transaction is not a failed one.
   */
  receiptAttempts?: number;
  /**
   * Asked before every lookup and every attempt. `true` ends tracking without any callback: nothing reads the result any
   * more, for example as the transaction was removed from the pool.
   * @returns Whether to stop.
   */
  isAbandoned?: () => boolean;
  /**
   * Called and awaited while waiting for `requiredConfirmations` (only when it is above 1). An error it throws is logged.
   * @param confirmations - The current number of confirmations.
   */
  onConfirmationsUpdate?: (confirmations: number) => Promise<void> | void;
  /**
   * Options for viem's `waitForTransactionReceipt`, merged over the defaults (`retryCount: 10`, `retryDelay: 3000`,
   * `timeout: 60000`).
   */
  waitForTransactionReceiptParams?: WaitForTransactionReceiptParameters;
};

/**
 * Tracks a standard EVM transaction by its hash, without a store. Use it to track transactions in your own state or on
 * a server.
 *
 * Steps (all RPC calls go through the wagmi client of `tx.chainId`):
 * 1. Calls `onInitialize`. Fails at once for the zero hash or when there is no client for the chain.
 * 2. Calls `getTransaction` up to `retryCount` times, `retryTimeout` ms apart, so a transaction the node has not
 *    indexed yet is still found; then calls `onTxDetailsFetched`. With `knownDetails` a hash the node does not show is
 *    no failure: the nonce decides.
 * 3. Waits for the receipt with `waitForTransactionReceipt`, for as long as `receiptAttempts` says. If viem reports a replacement,
 *    calls `onReplaced` and stops. After every attempt that ended without an answer, whatever the error, it reads the
 *    sender's nonce with {@link readNonceSlot} and reports a replacement it finds.
 * 4. If `requiredConfirmations` is above 1, polls `getTransactionConfirmations` every 5 s until it is reached, for the
 *    replacement too, reading the receipt again each time, so one a reorganization dropped goes back to waiting. With a
 *    finite `receiptAttempts` it stops after `receiptAttempts` times the `timeout`: `onFailure` for the transaction, and
 *    `onReplaced` for a replacement, whose nonce is spent anyway.
 * 5. Awaits `onSuccess`, also for reverted transactions.
 *
 * Reading the nonce between attempts is what makes a replacement visible at all: viem remembers the transaction only
 * inside one call, a new call must fetch it by hash, and a node stops returning the hash once the replacement reaches
 * its mempool. viem then skips the block scan for good, and a block mined between two calls is never read. Do not go
 * back to one long call either: a slow transaction would fail when it ends.
 *
 * An error thrown by `onSuccess` is passed to `onFailure`.
 *
 * @param params - The transaction, the wagmi config and the callbacks.
 * @returns A promise that resolves when tracking has finished.
 *
 * @example
 * ```ts
 * await evmTracker({
 *   config: wagmiConfig,
 *   tx: { txKey: hash, chainId: 1, requiredConfirmations: 2 },
 *   onTxDetailsFetched: (details) => console.log('Nonce', details.nonce),
 *   onSuccess: async (_details, receipt) => console.log('Mined with status', receipt.status),
 *   onReplaced: (replacement) => console.log('Replaced by', replacement.transaction.hash),
 *   onFailure: (error) => console.error('Tracking failed', error),
 * });
 * ```
 */
export async function evmTracker(params: EVMTrackerParams): Promise<void> {
  const {
    tx,
    config,
    knownDetails,
    onInitialize,
    onTxDetailsFetched,
    onSuccess,
    onFailure,
    onReplaced,
    retryCount = DEFAULT_RETRY_COUNT,
    retryTimeout = DEFAULT_RETRY_TIMEOUT_MS,
    notFoundUntil,
    receiptAttempts = DEFAULT_RECEIPT_ATTEMPTS,
    isAbandoned,
    onConfirmationsUpdate,
    waitForTransactionReceiptParams,
  } = params;
  const { requiredConfirmations } = tx;

  onInitialize?.();

  if (tx.txKey === zeroHash) {
    return onFailure(new Error('Transaction hash cannot be the zero hash.'));
  }

  const client = getClient(config, { chainId: tx.chainId as number });
  if (!client) {
    return onFailure(new Error(`Could not create a viem client for chainId: ${tx.chainId}`));
  }

  const hash = tx.txKey as Hex;
  let txDetails: GetTransactionReturnType | undefined;
  let slot = knownDetails;
  // Read before the first lookup: a transaction seen pending after this was not replaced before it. The margin is for
  // nodes behind a load balancer that disagree on the newest block.
  const startBlock = knownDetails
    ? undefined
    : await getBlockNumber(client, { cacheTime: 0 }).then(
        (block) => (block > FROM_BLOCK_MARGIN ? block - FROM_BLOCK_MARGIN : 0n),
        () => undefined,
      );
  let fromBlock: bigint | undefined;
  const scan: NonceSlotScan = {};
  let spentReadings = 0;
  let lastError: unknown;

  // viem quotes the RPC URL, which can hold a key, in its errors: logs get the name only
  const describe = (error: unknown) => (error instanceof Error ? error.name : 'Unknown');
  const attemptTimeout = waitForTransactionReceiptParams?.timeout ?? SINGLE_ATTEMPT_TIMEOUT;

  /**
   * Waits for the required confirmations, reading the receipt again on every round: by height alone, a receipt a
   * reorganization has dropped would count as final. A server keeps its limit here too, or one chain that makes no blocks
   * would hold its job for good.
   */
  const waitForConfirmations = async (
    receipt: TransactionReceipt,
  ): Promise<{ state: 'confirmed' | 'timedOut'; receipt: TransactionReceipt } | { state: 'reorged' }> => {
    const needed = requiredConfirmations ?? 1;
    if (needed <= 1) return { state: 'confirmed', receipt };
    const deadline = Number.isFinite(receiptAttempts) ? Date.now() + receiptAttempts * attemptTimeout : Infinity;
    let current = receipt;
    while (true) {
      try {
        current = await getTransactionReceipt(client, { hash: receipt.transactionHash });
        const confirmations = Number(await getTransactionConfirmations(client, { transactionReceipt: current }));
        await onConfirmationsUpdate?.(confirmations);
        if (confirmations >= needed) return { state: 'confirmed', receipt: current };
      } catch (error) {
        if (error instanceof Error && error.name === 'TransactionReceiptNotFoundError') return { state: 'reorged' };
        console.warn(
          `[evmTracker] Error fetching confirmations for ${tx.txKey} on chain ${tx.chainId}: ${describe(error)}.`,
        );
      }
      if (Date.now() >= deadline) return { state: 'timedOut', receipt: current };
      await sleep(CONFIRMATIONS_POLLING_INTERVAL);
    }
  };

  /** Ends tracking with the replacement. Returns `false` when a reorganization took it back. */
  const finishReplaced = async (replacement: ReplacementReturnType): Promise<boolean> => {
    const confirmed = await waitForConfirmations(replacement.transactionReceipt);
    if (confirmed.state === 'reorged') return false;
    try {
      // Past the limit it stays a replacement: the nonce is spent, only the count did not arrive
      await onReplaced({ ...replacement, transactionReceipt: confirmed.receipt });
    } catch (error) {
      console.error(`[evmTracker] onReplaced threw for ${tx.txKey} on chain ${tx.chainId}: ${describe(error)}.`);
    }
    return true;
  };

  /** Ends tracking with the receipt. Returns `false` when a reorganization took it back. */
  const finishMined = async (receipt: TransactionReceipt): Promise<boolean> => {
    try {
      // Without details so far (`knownDetails`) the node should have them now. A receipt is proof enough without them:
      // failing here would turn a mined transaction into a failed one.
      for (let lookup = 0; !txDetails && lookup < retryCount; lookup++) {
        try {
          txDetails = await getTransaction(client, { hash });
          onTxDetailsFetched(txDetails);
        } catch {
          if (lookup < retryCount - 1) await sleep(retryTimeout);
        }
      }
      // 3. Wait for required confirmations if specified.
      const confirmed = await waitForConfirmations(receipt);
      if (confirmed.state === 'reorged') return false;
      if (confirmed.state === 'timedOut') {
        await onFailure(
          new Error(`Transaction ${tx.txKey} did not reach ${requiredConfirmations} confirmations in time.`),
        );
        return true;
      }
      await onSuccess(txDetails, confirmed.receipt, client);
    } catch (error) {
      await onFailure(error);
    }
    return true;
  };

  /** Reads the sender's nonce. Returns `true` when that ended tracking. */
  const readSlot = async (): Promise<boolean> => {
    if (!slot) return false;
    let reading;
    try {
      reading = await readNonceSlot(client, { hash, slot, fromBlock, scan });
    } catch (error) {
      console.warn(`[evmTracker] Could not read the nonce of ${tx.txKey} on chain ${tx.chainId}: ${describe(error)}.`);
      return false;
    }
    if (reading.state === 'replaced') return finishReplaced(reading.replacement);
    if (reading.state === 'ours') {
      spentReadings = 0;
      // viem may not get this receipt: two trackers of one hash share its watcher, and the first one's timer stops it
      return reading.receipt ? finishMined(reading.receipt) : false;
    }
    if (reading.state === 'open') {
      spentReadings = 0;
      return false;
    }
    // Seen in a block, it holds its own nonce, so this only says the node's parts disagree
    if (txDetails?.blockNumber) return false;
    spentReadings += 1;
    if (spentReadings < SPENT_READINGS_TO_BELIEVE) return false;
    await onFailure(new NonceSlotSpentError(hash));
    return true;
  };

  // 1. Fetch the transaction details.
  for (let lookup = 0; !txDetails; lookup++) {
    if (isAbandoned?.()) return;
    try {
      txDetails = await getTransaction(client, { hash });
    } catch (error) {
      // Known from an earlier run: a hash the node does not show is what a replaced transaction looks like
      if (slot) break;
      // An RPC error is no answer: past the limit, only the node saying it has no such transaction ends the wait
      const notFound = error instanceof Error && error.name === 'TransactionNotFoundError';
      const gaveUp =
        lookup >= retryCount - 1 && (notFoundUntil === undefined || (notFound && Date.now() >= notFoundUntil));
      if (gaveUp) {
        console.error(
          `[evmTracker] Fatal error fetching transaction ${tx.txKey} on chain ${tx.chainId}: ${describe(error)}.`,
        );
        return onFailure(error);
      }
      const inFirstLookups = lookup < retryCount - 1;
      if (inFirstLookups) {
        console.warn(
          `[evmTracker] Error fetching transaction ${tx.txKey} on chain ${tx.chainId} (attempt ${lookup + 1}/${retryCount}): ${describe(error)}.`,
        );
      }
      await sleep(inFirstLookups ? retryTimeout : NOT_FOUND_SLOW_DELAY_MS);
      continue;
    }
    // Before the callback: an error in it must not leave the tracker without the sender and nonce
    slot = {
      from: txDetails.from,
      nonce: txDetails.nonce,
      to: txDetails.to,
      value: txDetails.value,
      input: txDetails.input,
    };
    fromBlock = txDetails.blockNumber ?? startBlock;
    try {
      onTxDetailsFetched(txDetails);
    } catch (error) {
      console.error(
        `[evmTracker] onTxDetailsFetched threw for ${tx.txKey} on chain ${tx.chainId}: ${describe(error)}.`,
      );
    }
  }

  // The replacement may have landed while nothing was tracking: no need to wait a whole attempt to say so
  if (!txDetails && (await readSlot())) return;

  // 2. Wait for the transaction to be mined and get the receipt. The limit is in time, not in attempts: an attempt ended
  // early by an RPC error must not use up what a slow transaction is owed, or 75 s of errors would end 7 minutes of waiting.
  const pauseAfter = (attempt: number) => Math.min(RECEIPT_RETRY_DELAY * (attempt + 1), MAX_RECEIPT_RETRY_DELAY);
  let waitBudget = Infinity;
  if (Number.isFinite(receiptAttempts)) {
    waitBudget = receiptAttempts * attemptTimeout;
    for (let attempt = 0; attempt < receiptAttempts - 1; attempt++) waitBudget += pauseAfter(attempt);
  }
  const waitUntil = Date.now() + waitBudget;

  for (let attempt = 0; Date.now() < waitUntil; attempt++) {
    if (isAbandoned?.()) return;
    let receipt: TransactionReceipt | undefined;
    let replacement: ReplacementReturnType | undefined;
    try {
      receipt = await waitForTransactionReceipt(client, {
        hash,
        onReplaced: (found) => {
          replacement = found;
        },
        retryCount: DEFAULT_RETRY_COUNT,
        retryDelay: DEFAULT_RETRY_TIMEOUT_MS,
        timeout: SINGLE_ATTEMPT_TIMEOUT,
        // Ignored by a viem older than 2.57.12; the reading between attempts then does the work alone
        ...(slot && { replacement: slot }),
        ...waitForTransactionReceiptParams,
      });
    } catch (error) {
      // Whatever it was (a timeout, an RPC error, a receipt behind its block), nothing is known about the transaction
      lastError = error;
      console.warn(
        `[evmTracker] No result yet for ${tx.txKey} on chain ${tx.chainId} (attempt ${attempt + 1}): ${describe(error)}.`,
      );
    }

    // viem's callback only records it: a throwing application callback inside viem would look like an RPC error
    if (replacement) {
      if (await finishReplaced(replacement)) return;
    } else if (receipt) {
      if (await finishMined(receipt)) return;
    } else if (await readSlot()) {
      return;
    }

    const left = waitUntil - Date.now();
    if (left > 0) await sleep(Math.min(pauseAfter(attempt), left));
  }

  await onFailure(lastError);
}

/**
 * Runs {@link evmTracker} for a transaction of the Pulsar store and writes the results to it through
 * `updateTxParams`: the on-chain sender and the other details at start, `confirmations`, and finally `status`
 * `Success`/`Failed` with `pending: false` and the block timestamp, or `Replaced` with `replacedTxHash` and
 * `replacedReason`. A replacement that reverted is `Replaced` with `isError: true`. The transaction is never removed
 * from the pool.
 *
 * Time alone never means `Failed`: the transaction stays `pending` until it has a receipt or its nonce is spent, as in a
 * wallet. A reload reads the saved sender and nonce, so a replacement that landed meanwhile is found. A nonce spent by a
 * transaction that cannot be found is `Replaced` with `replacedReason: 'unknown'`. Only a hash that no node has ever shown,
 * with nothing saved to read instead, fails: 24 hours after `localTimestamp`.
 *
 * The callbacks receive the transaction with every update written by the tracker (`createTxUpdater` from
 * `@tuwaio/pulsar-core`). A reverted transaction calls `onError` with `Error('Transaction reverted')`. An error thrown
 * by a callback is logged and does not change the status.
 *
 * @template T - The application transaction type.
 * @param params - The transaction, the wagmi config, the store members and the callbacks.
 * @returns A promise that resolves when tracking has finished.
 */
export async function evmTrackerForStore<T extends Transaction>(
  params: Pick<EVMTrackerParams, 'config'> &
    Pick<ITxTrackingStore<T>, 'updateTxParams' | 'transactionsPool'> &
    Partial<Pick<ITxTrackingStore<T>, 'isTxTracked'>> & {
      tx: T;
    } & TrackerCallbacks<T>,
) {
  const { tx, config, updateTxParams, transactionsPool, isTxTracked, onSuccess, onError, onReplaced } = params;
  const updateTx = createTxUpdater({ tx, transactionsPool, updateTxParams });

  return evmTracker({
    tx,
    config,
    ...storeTrackerOptions(tx, isTxTracked),
    onInitialize: () => {
      updateTx({ hash: tx.txKey as Hex });
    },
    ...storeCallbacks({ tx, config, updateTx, revertMessage: 'Transaction reverted', onSuccess, onError, onReplaced }),
  });
}
