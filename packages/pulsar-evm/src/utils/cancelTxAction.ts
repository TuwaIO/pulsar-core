import { Transaction, TransactionAdapter } from '@tuwaio/pulsar-core';
import { Config, getAccount, sendTransaction } from '@wagmi/core';
import { Hex } from 'viem';

/**
 * Cancels a pending transaction by sending a new, zero-value transaction to oneself
 * with the same nonce but a higher gas price.
 *
 * @param {object} params - The parameters for the cancellation.
 * @param {Config} params.config - The wagmi configuration object.
 * @param {T} params.tx - The transaction object to be canceled. Must contain nonce, gas fees, etc.
 *
 * @returns {Promise<Hex>} A promise that resolves with the hash of the new cancellation transaction.
 *
 * @throws {Error} Throws an error if the transaction is missing required fields or if sending fails.
 *
 * @example
 * ```ts
 * import { cancelTxAction } from './cancelTxAction';
 *
 * const handleCancel = async () => {
 * try {
 * const cancelTxHash = await cancelTxAction({
 * config: wagmiConfig,
 * tx: stuckTransaction,
 * });
 * console.log('Cancellation transaction sent:', cancelTxHash);
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
  console.log('cancelTxAction', tx);

  if (tx.adapter === TransactionAdapter.EVM) {
    // Ensure the transaction has all the necessary details for cancellation.
    if (!tx.nonce || !tx.maxFeePerGas || !tx.maxPriorityFeePerGas) {
      throw new Error('Transaction is missing required fields for cancellation (nonce, maxFeePerGas).');
    }

    try {
      if (!config) {
        throw new Error('Wagmi config is not provided.');
      }

      const account = getAccount(config);
      if (!account.address) {
        throw new Error('No connected account found.');
      }

      // Increase gas fees by 15% to ensure the cancellation transaction is prioritized.
      const gasIncreaseMultiplier = 115n; // 115%
      const divisor = 100n;
      const newPriorityFee = (BigInt(tx.maxPriorityFeePerGas) * gasIncreaseMultiplier) / divisor;
      const newMaxFee = (BigInt(tx.maxFeePerGas) * gasIncreaseMultiplier) / divisor;

      // Send a zero-value transaction to your own address with the same nonce.
      const hash = await sendTransaction(config, {
        to: account.address,
        value: 0n,
        chainId: tx.chainId as number,
        nonce: tx.nonce,
        maxFeePerGas: newMaxFee,
        maxPriorityFeePerGas: newPriorityFee,
      });

      return hash;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      // Re-throw the error with more context.
      throw new Error(`Failed to cancel transaction: ${errorMessage}`);
    }
  } else {
    throw new Error(`Failed to cancel transaction: not EVM tx adapter`);
  }
}
