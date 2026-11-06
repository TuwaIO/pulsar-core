/**
 * @file The results of the on-chain tracker as written to the Pulsar store, shared by the standard EVM tracker and the
 * on-chain stage of ERC-4337 and EIP-5792.
 */

import { normalizeError } from '@tuwaio/orbit-core';
import {
  createAbandonCheck,
  EvmTransaction,
  TrackerCallbacks,
  Transaction,
  TransactionStatus,
  UpdatableTransactionFields,
} from '@tuwaio/pulsar-core';
import { Config, getClient } from '@wagmi/core';
import dayjs from 'dayjs';
import { Client, GetTransactionReturnType, Hex, ReplacementReturnType, TransactionReceipt } from 'viem';
import { getBlock } from 'viem/actions';

import { NonceSlot, NonceSlotSpentError } from '../utils/readNonceSlot';

/** How long the store waits for a hash no node has ever shown, with no sender and nonce saved to read instead. */
const NOT_FOUND_LIMIT_SECONDS = 24 * 60 * 60;

/** The sender and nonce a tracker saved on the transaction; `from` is not used, as it is the wallet, not the sender. */
function savedSlot(tx: Transaction): NonceSlot | undefined {
  const { sender, nonce, to, value, input } = tx as EvmTransaction;
  if (!sender || nonce === undefined) return undefined;
  // A number by type, but a server's history brings a string, and a string never matched the nonce in a block
  return { from: sender, nonce: Number(nonce), to: to ?? null, value: value === undefined ? undefined : BigInt(value), input };
}

/**
 * How a store's tracker waits for a transaction: as `evmTracker` does for the first half hour, what a person watches, then less often,
 * as one stuck in the mempool cost the same at hour 1000 as in its first minute.
 */
function pacingOf(tx: Transaction) {
  return () => {
    const ageMs = Date.now() - Number(tx.localTimestamp) * 1000;
    if (ageMs < 30 * 60_000) return {};
    return ageMs < 2 * 60 * 60_000
      ? { windowMs: 30_000, pollingIntervalMs: 15_000 }
      : { windowMs: 60_000, pollingIntervalMs: 30_000 };
  };
}

/**
 * The options of `evmTracker` that make it a store's tracker: time alone never means `Failed`, a reload reads the saved
 * sender and nonce, and a transaction the store no longer tracks stops it.
 *
 * @internal
 * @param tx - The tracked transaction.
 * @param isTxTracked - `isTxTracked` of the store, when it has one.
 * @returns The options to pass to `evmTracker`.
 */
export function storeTrackerOptions(tx: Transaction, isTxTracked?: (txKey: string) => boolean) {
  return {
    knownDetails: savedSlot(tx),
    // A number by type, but a transaction injected from a server's history brings a string
    notFoundUntil: (Number(tx.localTimestamp) + NOT_FOUND_LIMIT_SECONDS) * 1000,
    receiptAttempts: Infinity,
    pacing: pacingOf(tx),
    isAbandoned: createAbandonCheck(isTxTracked, tx.txKey),
  };
}

/**
 * Runs a callback of the application. An error in it is the application's and says nothing about the transaction, so it
 * must never turn a mined transaction into a failed one.
 */
async function callSafely(name: string, callback: () => unknown): Promise<void> {
  try {
    await callback();
  } catch (error) {
    console.error(`[Pulsar] ${name} callback threw:`, error);
  }
}

/**
 * Builds the callbacks of `evmTracker` that write its results through `updateTx` and call the callbacks of the
 * application. The status comes from the receipt alone: an unreadable block only costs the block timestamp, which falls
 * back to the local time.
 *
 * @internal
 * @template T - The application transaction type.
 * @param params - The tracked transaction, the wagmi config, the updater and the callbacks.
 * @param params.tx - The tracked transaction.
 * @param params.config - The wagmi config.
 * @param params.updateTx - The updater from `createTxUpdater` of `@tuwaio/pulsar-core`.
 * @param params.revertMessage - The message of the error given to `onError` for a reverted transaction.
 * @param params.resultFields - Fields written with every final status.
 * @returns The callbacks to pass to `evmTracker`.
 */
export function storeCallbacks<T extends Transaction>({
  tx,
  config,
  updateTx,
  revertMessage,
  resultFields,
  onSuccess,
  onError,
  onReplaced,
}: {
  tx: T;
  config: Config;
  updateTx: (fields: UpdatableTransactionFields) => T | undefined;
  revertMessage: string;
  resultFields?: { hash: Hex };
} & TrackerCallbacks<T>) {
  const finishedAt = async (blockNumber: bigint, trackerClient?: Client) => {
    try {
      const client = trackerClient ?? getClient(config, { chainId: tx.chainId as number });
      if (!client) return dayjs().unix();
      return Number((await getBlock(client, { blockNumber })).timestamp);
    } catch (error) {
      console.warn(
        `[Pulsar] Could not read block ${blockNumber}, using the local time: ${error instanceof Error ? error.name : 'Unknown'}.`,
      );
      return dayjs().unix();
    }
  };

  return {
    onTxDetailsFetched: (txDetails: GetTransactionReturnType) => {
      updateTx({
        sender: txDetails.from,
        to: txDetails.to ?? undefined,
        input: txDetails.input,
        value: txDetails.value?.toString(),
        nonce: txDetails.nonce,
        maxFeePerGas: txDetails.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: txDetails.maxPriorityFeePerGas?.toString(),
      });
    },
    onConfirmationsUpdate: (confirmations: number) => {
      updateTx({ confirmations });
    },
    onSuccess: async (
      _txDetails: GetTransactionReturnType | undefined,
      receipt: TransactionReceipt,
      client: Client,
    ) => {
      const isSuccess = receipt.status === 'success';
      const status = isSuccess ? TransactionStatus.Success : TransactionStatus.Failed;
      const updatedTx = updateTx({
        ...resultFields,
        status,
        isError: !isSuccess,
        pending: false,
        finishedTimestamp: await finishedAt(receipt.blockNumber, client),
      });

      // The store kept another final result: callbacks must not say what the pool does not
      if (updatedTx?.status !== status) return;
      if (isSuccess) await callSafely('onSuccess', () => onSuccess?.(updatedTx));
      else await callSafely('onError', () => onError?.(new Error(revertMessage), updatedTx));
    },
    onReplaced: async (replacement: ReplacementReturnType) => {
      // A speed-up goes on in a new record, whose own result reports a revert. Nothing follows anything else.
      const reverted = replacement.reason !== 'repriced' && replacement.transactionReceipt.status === 'reverted';
      const updatedTx = updateTx({
        ...resultFields,
        status: TransactionStatus.Replaced,
        replacedTxHash: replacement.transaction.hash,
        replacedReason: replacement.reason,
        isError: reverted,
        pending: false,
        finishedTimestamp: await finishedAt(replacement.transactionReceipt.blockNumber),
      });

      if (updatedTx?.status !== TransactionStatus.Replaced) return;
      await callSafely('onReplaced', () => onReplaced?.(updatedTx, tx));
      if (reverted) await callSafely('onError', () => onError?.(new Error(revertMessage), updatedTx));
    },
    onFailure: async (error?: unknown) => {
      // The transaction can never land, but what spent its nonce may have moved the money: not a failure
      if (error instanceof NonceSlotSpentError) {
        const updatedTx = updateTx({
          ...resultFields,
          status: TransactionStatus.Replaced,
          replacedReason: 'unknown',
          isError: false,
          pending: false,
          finishedTimestamp: dayjs().unix(),
        });
        if (updatedTx?.status === TransactionStatus.Replaced) {
          await callSafely('onReplaced', () => onReplaced?.(updatedTx, tx));
        }
        return;
      }

      const updatedTx = updateTx({
        ...resultFields,
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        error: normalizeError(error),
        finishedTimestamp: dayjs().unix(),
      });

      if (updatedTx?.status === TransactionStatus.Failed)
        await callSafely('onError', () => onError?.(error, updatedTx));
    },
  };
}
