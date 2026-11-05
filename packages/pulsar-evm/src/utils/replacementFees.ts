/**
 * @file The rules shared by the wallet actions that replace a pending transaction: `speedUpTxAction` and `cancelTxAction`.
 */

import { EvmTransaction, Transaction } from '@tuwaio/pulsar-core';
import { Config, getClient } from '@wagmi/core';
import { isAddressEqual } from 'viem';
import { estimateFeesPerGas } from 'viem/actions';

type Fees = { maxFeePerGas: bigint; maxPriorityFeePerGas: bigint };

/**
 * The fees last sent for a nonce. The store keeps the fees of the original transaction and an adapter has no access to
 * it, while a node refuses a replacement that does not pay more than the one it holds. Lost on a reload, when the market
 * estimate has to be enough.
 */
const lastSentFees = new Map<string, Fees>();

const slotKey = (tx: Transaction) => {
  const { chainId, from, nonce, sender } = tx as EvmTransaction;
  return `${chainId}:${(sender ?? from).toLowerCase()}:${nonce}`;
};

/** A node's rule is 10%; 15% leaves room. In integers: a fee in wei does not fit a float. */
const raised = (fee: bigint) => (fee * 115n + 99n) / 100n;

/**
 * Refuses an account that did not send the transaction. Only the owner of a nonce can replace what holds it: from
 * another account the same transfer would simply be sent a second time. A relayed transaction is refused too, as its
 * nonce is the relayer's.
 *
 * @internal
 * @param account - The connected account.
 * @param tx - The transaction to replace.
 * @throws `Error` when the account is not the sender.
 */
export function assertSentBy(account: `0x${string}`, tx: Transaction): void {
  const { from, sender } = tx as EvmTransaction;
  const owner = (sender ?? from) as `0x${string}`;
  if (!isAddressEqual(account, owner)) {
    throw new Error(`The connected account ${account} did not send this transaction: ${owner} did.`);
  }
}

/**
 * The fees of a replacement: 15% above the fees last sent for this nonce, and at least the market estimate, since a
 * transaction stuck below the base fee stays stuck with 15% more. Without an estimate the 15% still goes out.
 *
 * Side effects: reads the fees of the chain over RPC (`eth_feeHistory` or `eth_gasPrice`, by viem's estimate).
 *
 * @internal
 * @param config - The wagmi config.
 * @param tx - The transaction to replace, with `maxFeePerGas` and `maxPriorityFeePerGas`.
 * @returns The fees to send.
 */
export async function replacementFees(config: Config, tx: Transaction): Promise<Fees> {
  const { chainId, maxFeePerGas, maxPriorityFeePerGas } = tx as EvmTransaction;
  const previous = lastSentFees.get(slotKey(tx)) ?? {
    maxFeePerGas: BigInt(maxFeePerGas as string),
    maxPriorityFeePerGas: BigInt(maxPriorityFeePerGas as string),
  };
  let maxFee = raised(previous.maxFeePerGas);
  let priorityFee = raised(previous.maxPriorityFeePerGas);

  try {
    const client = getClient(config, { chainId: chainId as number });
    if (client) {
      const market = await estimateFeesPerGas(client);
      if (market.maxFeePerGas > maxFee) maxFee = market.maxFeePerGas;
      if (market.maxPriorityFeePerGas > priorityFee) priorityFee = market.maxPriorityFeePerGas;
    }
  } catch (error) {
    console.warn('[Pulsar] Could not estimate the fees of the chain, raising the old ones only:', error);
  }

  return { maxFeePerGas: priorityFee > maxFee ? priorityFee : maxFee, maxPriorityFeePerGas: priorityFee };
}

/**
 * Remembers the fees a wallet accepted, so the next replacement of this nonce goes above them.
 *
 * @internal
 * @param tx - The replaced transaction.
 * @param fees - The fees sent.
 */
export function rememberSentFees(tx: Transaction, fees: Fees): void {
  lastSentFees.set(slotKey(tx), fees);
}
