/**
 * @file The on-chain stage shared by trackers whose transaction hash is known only later: ERC-4337 UserOperations and
 * EIP-5792 call batches.
 */

import { TrackerCallbacks, Transaction, TransactionStatus, UpdatableTransactionFields } from '@tuwaio/pulsar-core';
import { Config } from '@wagmi/core';
import dayjs from 'dayjs';
import { Hex } from 'viem';

import { evmTracker } from './evmTracker';
import { storeCallbacks, storeTrackerOptions } from './storeCallbacks';

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
 * @param params.isTxTracked - `isTxTracked` of the store, when it has one.
 * @returns A promise that resolves when the on-chain tracking has finished.
 */
export async function trackOnChainStage<T extends Transaction>({
  tx,
  hash,
  config,
  updateTx,
  isTxTracked,
  onSuccess,
  onError,
  onReplaced,
}: {
  tx: T;
  hash: Hex;
  config?: Config;
  updateTx: (fields: UpdatableTransactionFields) => T | undefined;
  isTxTracked?: (txKey: string) => boolean;
} & TrackerCallbacks<T>): Promise<void> {
  if (config) {
    return evmTracker({
      tx: {
        chainId: tx.chainId,
        txKey: hash,
        requiredConfirmations: tx.requiredConfirmations,
      },
      config,
      ...storeTrackerOptions(tx, isTxTracked),
      ...storeCallbacks({
        tx,
        config,
        updateTx,
        revertMessage: 'Transaction reverted on-chain.',
        resultFields: { hash },
        onSuccess,
        onError,
        onReplaced,
      }),
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
