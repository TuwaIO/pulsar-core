/**
 * @file The results of the on-chain tracker as written to the Pulsar store, shared by the standard EVM tracker and the
 * on-chain stage of ERC-4337 and EIP-5792.
 */

import { normalizeError } from '@tuwaio/orbit-core';
import { TrackerCallbacks, Transaction, TransactionStatus, UpdatableTransactionFields } from '@tuwaio/pulsar-core';
import { Config, getClient } from '@wagmi/core';
import dayjs from 'dayjs';
import { Client, GetTransactionReturnType, Hex, ReplacementReturnType, TransactionReceipt } from 'viem';
import { getBlock } from 'viem/actions';

import { NonceSlotSpentError } from '../utils/readNonceSlot';

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
      console.warn(`[Pulsar] Could not read block ${blockNumber}, using the local time:`, error);
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
    onSuccess: async (_txDetails: GetTransactionReturnType, receipt: TransactionReceipt, client: Client) => {
      const isSuccess = receipt.status === 'success';
      const updatedTx = updateTx({
        ...resultFields,
        status: isSuccess ? TransactionStatus.Success : TransactionStatus.Failed,
        isError: !isSuccess,
        pending: false,
        finishedTimestamp: await finishedAt(receipt.blockNumber, client),
      });

      if (!updatedTx) return;
      if (isSuccess) await callSafely('onSuccess', () => onSuccess?.(updatedTx));
      else await callSafely('onError', () => onError?.(new Error(revertMessage), updatedTx));
    },
    onReplaced: async (replacement: ReplacementReturnType) => {
      const reverted = replacement.transactionReceipt.status === 'reverted';
      const updatedTx = updateTx({
        ...resultFields,
        status: TransactionStatus.Replaced,
        replacedTxHash: replacement.transaction.hash,
        replacedReason: replacement.reason,
        isError: reverted,
        pending: false,
        finishedTimestamp: await finishedAt(replacement.transactionReceipt.blockNumber),
      });

      if (!updatedTx) return;
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
        if (updatedTx) await callSafely('onReplaced', () => onReplaced?.(updatedTx, tx));
        return;
      }

      const updatedTx = updateTx({
        ...resultFields,
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        error: normalizeError(error),
      });

      if (updatedTx) await callSafely('onError', () => onError?.(error, updatedTx));
    },
  };
}
