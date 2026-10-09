/**
 * @file The on-chain stage shared by trackers whose transaction hash is known only later: ERC-4337 UserOperations and
 * EIP-5792 call batches.
 */

import { normalizeError } from '@tuwaio/orbit-core';
import { TrackerCallbacks, Transaction, TransactionStatus, UpdatableTransactionFields } from '@tuwaio/pulsar-core';
import { Config } from '@wagmi/core';
import dayjs from 'dayjs';
import { Hex } from 'viem';
import { getBlock } from 'viem/actions';

import { evmTracker } from './evmTracker';

/**
 * Follows the transaction `hash` of a tracked transaction on-chain with {@link evmTracker} and writes the details,
 * confirmations and the final `Success`, `Failed` or `Replaced` status through `updateTx`. Without `config` the
 * transaction is marked `Success` at once.
 *
 * @internal
 * @template T - The application transaction type.
 * @param params - The tracked transaction, its on-chain hash, the wagmi config, the updater and the callbacks.
 * @param params.tx - The tracked transaction (its `chainId` and `requiredConfirmations` are used).
 * @param params.hash - The hash of the transaction that executed it.
 * @param params.config - The wagmi config; without it the transaction succeeds at once.
 * @param params.updateTx - The updater from `createTxUpdater` of `@tuwaio/pulsar-core`.
 * @returns A promise that resolves when the on-chain tracking has finished.
 */
export async function trackOnChainStage<T extends Transaction>({
  tx,
  hash,
  config,
  updateTx,
  onSuccess,
  onError,
  onReplaced,
}: {
  tx: T;
  hash: Hex;
  config?: Config;
  updateTx: (fields: UpdatableTransactionFields) => T | undefined;
} & TrackerCallbacks<T>): Promise<void> {
  if (config) {
    return evmTracker({
      tx: {
        chainId: tx.chainId,
        txKey: hash,
        requiredConfirmations: tx.requiredConfirmations,
      },
      config,
      onTxDetailsFetched: (txDetails) => {
        updateTx({
          to: txDetails.to ?? undefined,
          input: txDetails.input,
          value: txDetails.value?.toString(),
          nonce: txDetails.nonce,
          maxFeePerGas: txDetails.maxFeePerGas?.toString(),
          maxPriorityFeePerGas: txDetails.maxPriorityFeePerGas?.toString(),
        });
      },
      onConfirmationsUpdate: (confirmations) => {
        updateTx({ confirmations });
      },
      onSuccess: async (_txDetails, receipt, client) => {
        const block = await getBlock(client, { blockNumber: receipt.blockNumber });
        const timestamp = Number(block.timestamp);
        const isSuccess = receipt.status === 'success';

        const updatedTx = updateTx({
          status: isSuccess ? TransactionStatus.Success : TransactionStatus.Failed,
          isError: !isSuccess,
          pending: false,
          hash,
          finishedTimestamp: timestamp,
        });

        if (isSuccess && onSuccess && updatedTx) {
          onSuccess(updatedTx);
        }
        if (!isSuccess && onError && updatedTx) {
          onError(new Error('Transaction reverted on-chain.'), updatedTx);
        }
      },
      onFailure: (error) => {
        const updatedTx = updateTx({
          status: TransactionStatus.Failed,
          pending: false,
          isError: true,
          hash,
          error: normalizeError(error),
          finishedTimestamp: dayjs().unix(),
        });

        if (onError && updatedTx) {
          onError(error, updatedTx);
        }
      },
      onReplaced: (replacement) => {
        const updatedTx = updateTx({
          status: TransactionStatus.Replaced,
          replacedTxHash: replacement.transaction.hash,
          pending: false,
        });

        if (onReplaced && updatedTx) {
          onReplaced(updatedTx, tx);
        }
      },
    });
  }

  // Without a wagmi config (standalone use), the transaction succeeds once its hash is known
  const updatedTx = updateTx({
    status: TransactionStatus.Success,
    pending: false,
    isError: false,
    hash,
    finishedTimestamp: dayjs().unix(),
  });

  if (onSuccess && updatedTx) {
    onSuccess(updatedTx);
  }
}
