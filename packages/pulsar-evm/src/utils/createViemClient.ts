/**
 * @file This file contains a utility function for creating a viem Public Client.
 */

import { http } from '@wagmi/core';
import { Chain, createClient, PublicClient } from 'viem';

/**
 * Creates a viem Public Client for a specific chain.
 * This client is used to interact with the blockchain (e.g., fetch transaction details).
 *
 * @param {number} chainId - The ID of the chain for which to create the client.
 * @param {Chain[]} chains - An array of supported viem Chain objects.
 * @returns {PublicClient | undefined} A viem PublicClient instance if the chain is found in the provided array, otherwise undefined.
 * @ignore
 */
export function createViemClient(chainId: number, chains: Chain[]): PublicClient | undefined {
  // Use `find` to get the first matching chain object. It's more direct than `filter`.
  const chain = chains.find((c) => c.id === chainId);

  if (chain) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return createClient({
      chain: chain,
      transport: http(),
    });
  }

  // Return undefined if no matching chain was found in the configuration.
  return undefined;
}
