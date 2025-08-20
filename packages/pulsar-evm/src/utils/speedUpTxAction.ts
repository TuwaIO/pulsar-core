import { Transaction, TransactionAdapter } from '@tuwaio/pulsar-core';
import { Config, getAccount, sendTransaction } from '@wagmi/core';
import { Hex } from 'viem';

/**
 * Speeds up a pending transaction by resubmitting it with the same nonce but higher gas fees.
 * This is a common strategy to prevent a transaction from getting stuck.
 *
 * @param {object} params - The parameters required to speed up the transaction.
 * @param {Config} params.config - The wagmi configuration object.
 * @param {T} params.tx - The original transaction object that needs to be sped up.
 *
 * @returns {Promise<Hex>} A promise that resolves with the hash of the new, speed-up transaction.
 *
 * @throws {Error} Throws an error if the wagmi config is not provided, the account is not found,
 * or if the transaction is missing required fields (`nonce`, `maxFeePerGas`, etc.).
 *
 * @example
 * ```ts
 * import { speedUpTxAction } from './speedUpTxAction';
 *
 * const handleSpeedUp = async () => {
 * try {
 * const newTxHash = await speedUpTxAction({
 * config: wagmiConfig,
 * tx: stuckTransaction,
 * });
 * console.log('Transaction sped up with new hash:', newTxHash);
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
  console.log('speedUpTxAction', tx);

  if (tx.adapter === TransactionAdapter.EVM) {
    // Ensure all necessary transaction details are present.
    if (!tx.nonce || !tx.from || !tx.to || !tx.value || !tx.input || !tx.maxFeePerGas || !tx.maxPriorityFeePerGas) {
      throw new Error('Transaction is missing required fields for speed-up.');
    }

    try {
      if (!config) {
        throw new Error('Wagmi config is not provided.');
      }

      const account = getAccount(config);
      if (!account.address) {
        throw new Error('No connected account found.');
      }

      // To replace a pending transaction, the new gas fees must be higher.
      // We increase both fees by 15% as a common strategy to ensure replacement.
      const gasIncreaseMultiplier = 115n; // 115%
      const divisor = 100n;
      const newPriorityFee = (BigInt(tx.maxPriorityFeePerGas) * gasIncreaseMultiplier) / divisor;
      const newMaxFee = (BigInt(tx.maxFeePerGas) * gasIncreaseMultiplier) / divisor;

      // Resubmit the transaction with the same details but higher gas fees.
      return await sendTransaction(config, {
        to: tx.to as Hex,
        value: BigInt(tx.value),
        data: tx.input as Hex,
        chainId: tx.chainId as number,
        nonce: tx.nonce,
        maxFeePerGas: newMaxFee,
        maxPriorityFeePerGas: newPriorityFee,
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      // Re-throw the error with more context.
      throw new Error(`Failed to speed up transaction: ${errorMessage}`);
    }
  } else {
    throw new Error(`Failed to speed up transaction: not EVM tx adapter`);
  }
}
