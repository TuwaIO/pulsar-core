/**
 * @file Speeds up a pending EVM transaction by resending it with higher fees.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { Transaction } from '@tuwaio/pulsar-core';
import { Config, getAccount, sendTransaction } from '@wagmi/core';
import { Hex } from 'viem';

// A common strategy is to increase gas by at least 10% to ensure replacement.
// We use 15% for a higher chance of success.
const GAS_INCREASE_PERCENTAGE = 1.15;

/**
 * Speeds up a pending EVM transaction: asks the connected wallet to resend it (same `to`, `value`, `input` and nonce)
 * with both EIP-1559 fees raised by 15%. When it is mined, the tracker of the original transaction reports it as
 * `Replaced`; the new transaction itself is not added to the pool.
 *
 * Side effects: opens a wallet prompt and broadcasts a transaction.
 *
 * @template T - The application transaction type.
 * @param params - The wagmi config and the transaction.
 * @param params.config - The wagmi config of the app.
 * @param params.tx - The pending transaction. It must be an EVM transaction with `nonce`, `from`, `to`, `value`,
 * `maxFeePerGas` and `maxPriorityFeePerGas` (set by the EVM tracker once the transaction details are fetched).
 * @returns The hash of the replacement transaction.
 * @throws `Error` when the transaction is not an EVM transaction or lacks the required fields, and
 * `Error('Failed to speed up transaction: …')` (with the original error as `cause`) when no account is connected or
 * the wallet rejects or fails to send the transaction.
 *
 * @example
 * ```ts
 * const hash = await speedUpTxAction({ config: wagmiConfig, tx: pendingTx });
 * ```
 */
export async function speedUpTxAction<T extends Transaction>({ config, tx }: { config: Config; tx: T }): Promise<Hex> {
  // 1. Validate the transaction type
  if (tx.adapter !== OrbitAdapter.EVM) {
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
    throw new Error(`Failed to speed up transaction: ${errorMessage}`, { cause: e });
  }
}
