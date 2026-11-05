/**
 * @file Speeds up a pending EVM transaction by resending it with higher fees.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { Transaction } from '@tuwaio/pulsar-core';
import { Config, getAccount, sendTransaction } from '@wagmi/core';
import { Hex } from 'viem';

import { assertSentBy, rememberSentFees, replacementFees } from './replacementFees';

/**
 * Speeds up a pending EVM transaction: asks the connected wallet to resend it (same `to`, `value`, `input` and nonce)
 * with both EIP-1559 fees 15% above the fees last sent for this nonce, and at least at the market estimate, since a
 * transaction stuck below the base fee stays stuck with 15% more. When it is mined, the tracker of the original
 * transaction reports it as `Replaced` with `replacedReason: 'repriced'`; the new transaction itself is not added to the
 * pool.
 *
 * Side effects: reads the fees of the chain over RPC, opens a wallet prompt, broadcasts a transaction, and keeps the fees
 * sent in memory for the next replacement of this nonce.
 *
 * @template T - The application transaction type.
 * @param params - The wagmi config and the transaction.
 * @param params.config - The wagmi config of the app.
 * @param params.tx - The pending transaction. It must be an EVM transaction with `nonce`, `from`, `to`, `value`,
 * `maxFeePerGas` and `maxPriorityFeePerGas` (set by the EVM tracker once the transaction details are fetched).
 * @returns The hash of the replacement transaction.
 * @throws `Error` when the transaction is not an EVM transaction or lacks the required fields, and
 * `Error('Failed to speed up transaction: …')` (with the original error as `cause`) when no account is connected, the
 * connected account did not send the transaction (from another account the same transfer would be sent a second time),
 * or the wallet rejects or fails to send the transaction.
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

    assertSentBy(account.address, tx);

    // 4. Calculate new gas fees.
    const fees = await replacementFees(config, tx);

    // 5. Resubmit the transaction with the same details but higher gas fees.
    const hash = await sendTransaction(config, {
      account: account.address,
      to: to as Hex,
      value: BigInt(value),
      data: (input as Hex) || '0x',
      chainId: chainId as number,
      nonce: nonce,
      ...fees,
    });
    rememberSentFees(tx, fees);
    return hash;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    // Re-throw the error with more context for easier debugging.
    throw new Error(`Failed to speed up transaction: ${errorMessage}`, { cause: e });
  }
}
