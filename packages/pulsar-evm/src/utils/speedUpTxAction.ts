/**
 * @file This file contains a utility function for speeding up a pending EVM transaction.
 */

import { Transaction, TransactionAdapter } from '@tuwaio/pulsar-core';
import { Config, getAccount, sendTransaction } from '@wagmi/core';
import { Hex } from 'viem';

// A common strategy is to increase gas by at least 10% to ensure replacement.
// We use 15% for a higher chance of success.
const GAS_INCREASE_PERCENTAGE = 1.15;

/**
 * Speeds up a pending EVM transaction by resubmitting it with the same nonce but higher gas fees.
 * This function is designed to work with wagmi's configuration and actions.
 *
 * @template TR - The type of the tracker identifier.
 * @template T - The transaction type, which must be a valid EVM transaction.
 *
 * @param {object} params - The parameters required to speed up the transaction.
 * @param {Config} params.config - The wagmi configuration object.
 * @param {T} params.tx - The original transaction object that needs to be sped up. It must contain all necessary EVM fields.
 *
 * @returns {Promise<Hex>} A promise that resolves with the hash of the new, speed-up transaction.
 *
 * @throws {Error} Throws an error if:
 * - The transaction is not an EVM transaction.
 * - The transaction is missing required fields (`nonce`, `from`, `to`, `value`, `maxFeePerGas`, etc.).
 * - The wagmi config is not provided.
 * - No connected account is found.
 * - The `sendTransaction` call fails for any reason.
 *
 * @example
 * ```ts
 * const handleSpeedUp = async (stuckTransaction) => {
 * try {
 * const newTxHash = await speedUpTxAction({
 * config: wagmiConfig,
 * tx: stuckTransaction,
 * });
 * console.log('Transaction sped up with new hash:', newTxHash);
 * // You should now update your state to track this new transaction hash.
 * } catch (error) {
 * console.error('Failed to speed up transaction:', error);
 * }
 * };
 * ```
 */
export async function speedUpTxAction<TR, T extends Transaction<TR>>({
  config,
  tx,
}: {
  config: Config;
  tx: T;
}): Promise<Hex> {
  // 1. Validate the transaction type
  if (tx.adapter !== TransactionAdapter.EVM) {
    throw new Error(`Speed up is only available for EVM transactions. Received adapter type: '${tx.adapter}'.`);
  }

  // 2. Ensure all necessary transaction details are present.
  const { nonce, from, to, value, input, maxFeePerGas, maxPriorityFeePerGas, chainId } = tx;

  if (nonce === undefined || !from || !to || !value || !maxFeePerGas || !maxPriorityFeePerGas) {
    throw new Error('Transaction is missing required fields for speed-up.');
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
    // We increase both fees to ensure the new transaction replaces the old one.
    // Using floating point for calculation and converting back to BigInt at the end.
    const newPriorityFee = BigInt(Math.ceil(Number(maxPriorityFeePerGas) * GAS_INCREASE_PERCENTAGE));
    const newMaxFee = BigInt(Math.ceil(Number(maxFeePerGas) * GAS_INCREASE_PERCENTAGE));

    // 5. Resubmit the transaction with the same details but higher gas fees.
    return await sendTransaction(config, {
      to: to as Hex,
      value: BigInt(value),
      data: (input as Hex) || '0x',
      chainId: chainId as number,
      nonce: nonce,
      maxFeePerGas: newMaxFee,
      maxPriorityFeePerGas: newPriorityFee,
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    // Re-throw the error with more context for easier debugging.
    throw new Error(`Failed to speed up transaction: ${errorMessage}`);
  }
}
