/**
 * @file Cancels a pending EVM transaction by replacing it with a zero-value transaction.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { Transaction } from '@tuwaio/pulsar-core';
import { Config, getAccount, sendTransaction } from '@wagmi/core';
import { Hex } from 'viem';

import { assertSentBy, rememberSentFees, replacementFees } from './replacementFees';

/**
 * Cancels a pending EVM transaction: asks the connected wallet to send a zero-value transaction to its own address with
 * the same nonce and both EIP-1559 fees 15% above the fees last sent for this nonce, and at least at the market estimate,
 * since a cancellation stuck below the base fee cancels nothing. When it is mined, the tracker of the original
 * transaction reports it as `Replaced` with `replacedReason: 'cancelled'`; the cancellation transaction itself is not
 * added to the pool.
 *
 * Side effects: reads the fees of the chain over RPC, opens a wallet prompt, broadcasts a transaction, and keeps the fees
 * sent for the next replacement of this nonce, in memory and in `sessionStorage` under
 * `pulsar-evm:replacementFees:<chain>:<sender>:<nonce>`.
 *
 * @template T - The application transaction type.
 * @param params - The wagmi config and the transaction.
 * @param params.config - The wagmi config of the app.
 * @param params.tx - The pending transaction. It must be an EVM transaction with `nonce`, `maxFeePerGas` and
 * `maxPriorityFeePerGas` (set by the EVM tracker once the transaction details are fetched).
 * @returns The hash of the cancellation transaction.
 * @throws `Error` when the transaction is not an EVM transaction or lacks the nonce and fee fields, and
 * `Error('Failed to cancel transaction: …')` (with the original error as `cause`) when no account is connected, the
 * connected account did not send the transaction, or the wallet rejects or fails to send the transaction.
 *
 * @example
 * ```ts
 * const hash = await cancelTxAction({ config: wagmiConfig, tx: pendingTx });
 * ```
 */
export async function cancelTxAction<T extends Transaction>({ config, tx }: { config: Config; tx: T }): Promise<Hex> {
  // 1. Validate the transaction type
  if (tx.adapter !== OrbitAdapter.EVM) {
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

    assertSentBy(account.address, tx);

    // 4. Calculate new gas fees.
    const fees = await replacementFees(config, tx);

    // 5. Send a zero-value transaction to your own address with the same nonce and higher gas.
    const hash = await sendTransaction(config, {
      account: account.address,
      to: account.address,
      value: 0n,
      chainId: chainId as number,
      nonce: nonce,
      ...fees,
    });
    rememberSentFees(tx, fees);
    return hash;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    // Re-throw the error with more context for easier debugging.
    throw new Error(`Failed to cancel transaction: ${errorMessage}`, { cause: e });
  }
}
