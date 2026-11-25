/**
 * @file What a chain and its nodes answer: reads of one node in time, reads through the connected wallet's own node, and whether a
 * sender and nonce identify a transaction there.
 */

import { Config } from '@wagmi/core';
import { Chain, Client, createClient, custom, EIP1193Provider } from 'viem';

/** How long one node may take to answer: nothing else waits for it for longer. */
const NODE_READ_TIMEOUT_MS = 3000;

/**
 * The answer of a node, or an error once it took too long.
 *
 * @internal
 * @param answer - The read.
 * @returns What the node answered.
 * @throws The error of the read, or `Error` after {@link NODE_READ_TIMEOUT_MS}.
 */
export async function inTime<T>(answer: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const late = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error('The node did not answer')), NODE_READ_TIMEOUT_MS);
  });
  try {
    return await Promise.race([answer, late]);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Reads the chain through the connected wallet's own provider, with no prompt: the wallet's RPC may be the only one that answers, or
 * the only place that holds a hash (a fee below what public nodes keep, a private mempool). Only a wallet on the chain is asked. No
 * answer in {@link NODE_READ_TIMEOUT_MS}, an error or no connection all come to the same: `undefined`.
 *
 * @internal
 * @param config - The wagmi config.
 * @param chainId - The chain to read.
 * @param read - The read, given a client over the wallet's provider.
 * @param chain - The chain, for a read that needs its rules.
 * @returns What the wallet's node answered.
 */
export async function readThroughWallet<T>(
  config: Config,
  chainId: number,
  read: (wallet: Client) => Promise<T>,
  chain?: Chain,
): Promise<T | undefined> {
  // A server's config has no connections, and one that is no real wagmi config has no state to read them from
  for (const { chainId: on, connector } of config.state?.connections?.values() ?? []) {
    if (on !== chainId) continue;
    const ask = async () => {
      const provider = (await connector.getProvider()) as EIP1193Provider;
      return read(createClient({ chain, transport: custom(provider, { retryCount: 0 }) }));
    };
    try {
      return await inTime(ask());
    } catch {
      // The next wallet, or no answer at all
    }
  }
  return undefined;
}

/**
 * Whether a chain has nonce lanes, where a sender and nonce do not identify a transaction.
 *
 * @internal
 * @param chain - The chain.
 * @returns `true` when its sender and nonce say nothing of a transaction.
 */
export function hasNonceLanes(chain: Chain | undefined): boolean {
  const replacement = (chain as { transactionReplacement?: { getKey?: unknown } } | undefined)?.transactionReplacement;
  return Boolean(replacement?.getKey);
}
