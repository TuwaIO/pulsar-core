/**
 * @file This file contains a utility function for canceling a pending EVM transaction.
 */

import { Transaction, TransactionAdapter } from '@tuwaio/pulsar-core';
import { Config, getAccount, sendTransaction } from '@wagmi/core';
import { Hex } from 'viem';

// A common strategy is to increase gas by at least 10% to ensure replacement.
// We use 15% for a higher chance of success.
const GAS_INCREASE_PERCENTAGE = 1.15;

/**
 * Cancels a pending EVM transaction by sending a new, zero-value transaction to oneself
 * with the same nonce but higher gas fees. This effectively replaces the original transaction.
 *
 * @template T - The transaction type, which must be a valid EVM transaction.
 *
 * @param {object} params - The parameters required to cancel the transaction.
 * @param {Config} params.config - The wagmi configuration object.
 * @param {T} params.tx - The original transaction object to be canceled. It must contain the nonce and gas fee fields.
 *
 * @returns {Promise<Hex>} A promise that resolves with the hash of the new cancellation transaction.
 *
 * @throws {Error} Throws an error if:
 * - The transaction is not an EVM transaction.
 * - The transaction is missing required fields (`nonce`, `maxFeePerGas`, etc.).
 * - The wagmi config is not provided.
 * - No connected account is found.
 * - The `sendTransaction` call fails.
 *
 * @example
 * ```ts
 * const handleCancel = async (stuckTransaction) => {
 * try {
 * const cancelTxHash = await cancelTxAction({
 * config: wagmiConfig,
 * tx: stuckTransaction,
 * });
 * console.log('Cancellation transaction sent with hash:', cancelTxHash);
 * // You should now update your state to track this new transaction.
 * } catch (error) {
 * console.error('Failed to cancel transaction:', error);
 * }
 * };
 * ```
 */
export async function cancelTxAction<T extends Transaction<any>>({
  config,
  tx,
}: {
  config: Config;
  tx: T;
}): Promise<Hex> {
  // 1. Validate the transaction type
  if (tx.adapter !== TransactionAdapter.EVM) {
    throw new Error(`Cancellation is only available for EVM transactions. Received adapter type: '${tx.adapter}'.`);
  }

  // 2. Ensure all necessary transaction details are present.
  const { nonce, maxFeePerGas, maxPriorityFeePerGas, chainId } = tx;

  if (nonce === undefined || !maxFeePerGas || !maxPriorityFeePerGas) {
    throw new Error(
      'Transaction is missing required fields for cancellation (nonce, maxFeePerGas, maxPriorityFeePerGas).',
    );
  }

  try {
    // 3. Verify wagmi configuration and connected account
    if (!config) {
      throw new Error('Wagmi config is not provided.');
    }
    const account = getAccount(config);
    if (!account.address) {
      throw new Error('No connected account found.');
    }

    // 4. Calculate new gas fees.
    const newPriorityFee = BigInt(Math.ceil(Number(maxPriorityFeePerGas) * GAS_INCREASE_PERCENTAGE));
    const newMaxFee = BigInt(Math.ceil(Number(maxFeePerGas) * GAS_INCREASE_PERCENTAGE));

    // 5. Send a zero-value transaction to your own address with the same nonce and higher gas.
    return await sendTransaction(config, {
      to: account.address,
      value: 0n,
      chainId: chainId as number,
      nonce: nonce,
      maxFeePerGas: newMaxFee,
      maxPriorityFeePerGas: newPriorityFee,
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    // Re-throw the error with more context for easier debugging.
    throw new Error(`Failed to cancel transaction: ${errorMessage}`);
  }
}
