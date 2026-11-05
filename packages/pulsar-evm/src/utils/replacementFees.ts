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
 * it, while a node refuses a replacement that does not pay more than the one it holds. `sessionStorage` keeps them over a
 * reload.
 */
const lastSentFees = new Map<string, Fees>();
const STORAGE_KEY_PREFIX = 'pulsar-evm:replacementFees:';

/** `sessionStorage` where it exists: the tab's memory, which a reload keeps. A blocked one only costs that. */
function readSavedFees(key: string): Fees | undefined {
  const inMemory = lastSentFees.get(key);
  if (inMemory) return inMemory;
  try {
    const saved = globalThis.sessionStorage?.getItem(STORAGE_KEY_PREFIX + key);
    if (!saved) return undefined;
    const { maxFeePerGas, maxPriorityFeePerGas } = JSON.parse(saved) as Record<keyof Fees, string>;
    return { maxFeePerGas: BigInt(maxFeePerGas), maxPriorityFeePerGas: BigInt(maxPriorityFeePerGas) };
  } catch {
    return undefined;
  }
}

const slotKey = (tx: Transaction) => {
  const { chainId, from, nonce, sender } = tx as EvmTransaction;
  return `${chainId}:${(sender ?? from).toLowerCase()}:${nonce}`;
};

/** A node's rule is 10%; 15% leaves room. In integers: a fee in wei does not fit a float. */
const raised = (fee: bigint) => {
  const up = (fee * 115n + 99n) / 100n;
  // 15% of nothing is nothing, and a node refuses a replacement that does not pay more
  return up > fee ? up : fee + 1n;
};

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
 * The fees of a replacement sent by the wallet itself, or from another tab, are not known here: if they are higher, the
 * node refuses this one and the error says so.
 *
 * Side effects: reads the fees of the chain over RPC (`eth_getBlockByNumber` and `eth_maxPriorityFeePerGas`, by viem's
 * estimate) and the fees last sent from `sessionStorage`.
 *
 * @internal
 * @param config - The wagmi config.
 * @param tx - The transaction to replace, with `maxFeePerGas` and `maxPriorityFeePerGas`.
 * @returns The fees to send.
 */
export async function replacementFees(config: Config, tx: Transaction): Promise<Fees> {
  const { chainId, maxFeePerGas, maxPriorityFeePerGas } = tx as EvmTransaction;
  const previous = readSavedFees(slotKey(tx)) ?? {
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
 * Remembers the fees a wallet accepted, so the next replacement of this nonce goes above them, also after a reload.
 *
 * Side effects: writes `pulsar-evm:replacementFees:<chain>:<sender>:<nonce>` to `sessionStorage`, which holds only the two
 * fees and goes away with the tab.
 *
 * @internal
 * @param tx - The replaced transaction.
 * @param fees - The fees sent.
 */
export function rememberSentFees(tx: Transaction, fees: Fees): void {
  const key = slotKey(tx);
  lastSentFees.set(key, fees);
  try {
    globalThis.sessionStorage?.setItem(
      STORAGE_KEY_PREFIX + key,
      JSON.stringify({
        maxFeePerGas: fees.maxFeePerGas.toString(),
        maxPriorityFeePerGas: fees.maxPriorityFeePerGas.toString(),
      }),
    );
  } catch {
    // The memory above still serves this page
  }
}
