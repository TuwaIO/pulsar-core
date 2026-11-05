/**
 * @file The tracker for standard EVM transactions. It uses viem actions (`getTransaction`,
 * `waitForTransactionReceipt`, `getTransactionConfirmations`, `getBlock`) through the wagmi client of the chain.
 */

import { createTxUpdater, EvmTransaction, ITxTrackingStore, TrackerCallbacks, Transaction } from '@tuwaio/pulsar-core';
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
import { getBlockNumber, getTransaction, getTransactionConfirmations, waitForTransactionReceipt } from 'viem/actions';

import { NonceSlot, NonceSlotSpentError, readNonceSlot } from '../utils/readNonceSlot';
import { storeCallbacks } from './storeCallbacks';

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
/** How long the store waits for a hash no node has ever shown, with no sender and nonce saved to read instead. */
const NOT_FOUND_LIMIT_SECONDS = 24 * 60 * 60;

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
   * @param txDetails - The result of `getTransaction`.
   * @param receipt - The transaction receipt.
   * @param client - The viem client of the chain, for further RPC calls.
   */
  onSuccess: (txDetails: GetTransactionReturnType, receipt: TransactionReceipt, client: Client) => Promise<void>;
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
  /** Number of `getTransaction` attempts. Defaults to 10. */
  retryCount?: number;
  /** Delay between `getTransaction` attempts, in milliseconds. Defaults to 3000. */
  retryTimeout?: number;
  /**
   * When to stop looking for a hash the node has never shown, in milliseconds since the epoch. Past `retryCount`
   * attempts it looks every 30 s. Defaults to stopping after `retryCount` attempts.
   */
  notFoundUntil?: number;
  /**
   * How many times to wait for the receipt, each up to the `timeout` of `waitForTransactionReceiptParams`, with pauses
   * of 5, 10, 15 s and so on, up to 30 s. Between attempts the tracker reads the nonce of the sender. Defaults to 6, 435 s
   * in all with the default `timeout`. `Infinity` waits until there is a receipt or a replacement: a slow transaction is
   * not a failed one.
   */
  receiptAttempts?: number;
  /**
   * Called while waiting for `requiredConfirmations` (only when it is above 1).
   * @param confirmations - The current number of confirmations.
   */
  onConfirmationsUpdate?: (confirmations: number) => void;
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
 * 3. Waits for the receipt with `waitForTransactionReceipt`, up to `receiptAttempts` times. If viem reports a replacement,
 *    calls `onReplaced` and stops. After every attempt that ended without an answer, whatever the error, it reads the
 *    sender's nonce with {@link readNonceSlot} and reports a replacement it finds.
 * 4. If `requiredConfirmations` is above 1, polls `getTransactionConfirmations` every 5 s until it is reached, for the
 *    replacement too.
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
  // A transaction seen pending was not replaced yet, so nothing older than this block can hold its replacement
  let fromBlock: bigint | undefined;
  let spentReadings = 0;

  const waitForConfirmations = async (receipt: TransactionReceipt) => {
    const needed = requiredConfirmations ?? 1;
    if (needed <= 1) return;
    while (true) {
      try {
        const current = Number(await getTransactionConfirmations(client, { transactionReceipt: receipt }));
        onConfirmationsUpdate?.(current);
        if (current >= needed) return;
      } catch (error) {
        console.warn(`[evmTracker] Error fetching confirmations for ${tx.txKey} on chain ${tx.chainId}:`, error);
      }
      await sleep(CONFIRMATIONS_POLLING_INTERVAL);
    }
  };

  const finishReplaced = async (replacement: ReplacementReturnType) => {
    await waitForConfirmations(replacement.transactionReceipt);
    try {
      await onReplaced(replacement);
    } catch (error) {
      console.error(`[evmTracker] onReplaced threw for ${tx.txKey} on chain ${tx.chainId}:`, error);
    }
  };

  /** Reads the sender's nonce. Returns `true` when that ended tracking. */
  const readSlot = async (): Promise<boolean> => {
    if (!slot) return false;
    try {
      const reading = await readNonceSlot(client, { hash, slot, fromBlock });
      if (reading.state === 'replaced') {
        await finishReplaced(reading.replacement);
        return true;
      }
      if (reading.state !== 'spent') {
        spentReadings = 0;
        return false;
      }
      spentReadings += 1;
      if (spentReadings < SPENT_READINGS_TO_BELIEVE) return false;
      await onFailure(new NonceSlotSpentError(hash));
      return true;
    } catch (error) {
      console.warn(`[evmTracker] Could not read the nonce of ${tx.txKey} on chain ${tx.chainId}:`, error);
      return false;
    }
  };

  // 1. Fetch the transaction details.
  for (let lookup = 0; !txDetails; lookup++) {
    try {
      txDetails = await getTransaction(client, { hash });
      onTxDetailsFetched(txDetails);
      slot = {
        from: txDetails.from,
        nonce: txDetails.nonce,
        to: txDetails.to,
        value: txDetails.value,
        input: txDetails.input,
      };
      fromBlock = txDetails.blockNumber ?? (await getBlockNumber(client, { cacheTime: 0 }).catch(() => undefined));
    } catch (error) {
      // Known from an earlier run: a hash the node does not show is what a replaced transaction looks like
      if (slot) break;
      const gaveUp = notFoundUntil === undefined ? lookup >= retryCount - 1 : Date.now() >= notFoundUntil;
      if (gaveUp) {
        console.error(`[evmTracker] Fatal error fetching transaction ${tx.txKey} on chain ${tx.chainId}:`, error);
        return onFailure(error);
      }
      const inFirstLookups = lookup < retryCount - 1;
      if (inFirstLookups) {
        console.warn(
          `[evmTracker] Error fetching transaction ${tx.txKey} on chain ${tx.chainId} (attempt ${lookup + 1}/${retryCount}):`,
          error,
        );
      }
      await sleep(inFirstLookups ? retryTimeout : NOT_FOUND_SLOW_DELAY_MS);
    }
  }

  // The replacement may have landed while nothing was tracking: no need to wait a whole attempt to say so
  if (!txDetails && (await readSlot())) return;

  // 2. Wait for the transaction to be mined and get the receipt.
  let lastError: unknown;
  for (let attempt = 0; attempt < receiptAttempts; attempt++) {
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
        `[evmTracker] No result yet for ${tx.txKey} on chain ${tx.chainId} (attempt ${attempt + 1}/${receiptAttempts}): ${
          error instanceof Error ? error.name : 'Unknown'
        }.`,
      );
    }

    // viem's callback only records it: a throwing application callback inside viem would look like an RPC error
    if (replacement) return finishReplaced(replacement);

    if (receipt) {
      try {
        // Without details so far (`knownDetails`), the transaction is mined now, so the node has it
        let details = txDetails;
        for (let lookup = 0; !details; lookup++) {
          try {
            details = await getTransaction(client, { hash });
            onTxDetailsFetched(details);
          } catch (error) {
            if (lookup >= retryCount - 1) throw error;
            await sleep(retryTimeout);
          }
        }
        // 3. Wait for required confirmations if specified.
        await waitForConfirmations(receipt);
        await onSuccess(details, receipt, client);
      } catch (error) {
        await onFailure(error);
      }
      return;
    }

    if (await readSlot()) return;

    if (attempt < receiptAttempts - 1) {
      await sleep(Math.min(RECEIPT_RETRY_DELAY * (attempt + 1), MAX_RECEIPT_RETRY_DELAY));
    }
  }

  await onFailure(lastError);
}

/** The sender and nonce a tracker saved on the transaction; `from` is not used, as it is the wallet, not the sender. */
function savedSlot(tx: Transaction): NonceSlot | undefined {
  const { sender, nonce, to, value, input } = tx as EvmTransaction;
  if (!sender || nonce === undefined) return undefined;
  return { from: sender, nonce, to, value: value === undefined ? undefined : BigInt(value), input };
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
    Pick<ITxTrackingStore<T>, 'updateTxParams' | 'transactionsPool'> & {
      tx: T;
    } & TrackerCallbacks<T>,
) {
  const { tx, config, updateTxParams, transactionsPool, onSuccess, onError, onReplaced } = params;
  const updateTx = createTxUpdater({ tx, transactionsPool, updateTxParams });

  return evmTracker({
    tx,
    config,
    knownDetails: savedSlot(tx),
    notFoundUntil: (tx.localTimestamp + NOT_FOUND_LIMIT_SECONDS) * 1000,
    receiptAttempts: Infinity,
    onInitialize: () => {
      updateTx({ hash: tx.txKey as Hex });
    },
    ...storeCallbacks({ tx, config, updateTx, revertMessage: 'Transaction reverted', onSuccess, onError, onReplaced }),
  });
}
