/**
 * @file This file contains a utility to robustly verify the Solana cluster by its genesis hash.
 */

import { createSolanaRpc } from '@solana/kit';

import { SolanaChainMismatchError } from '../errors';
import { SolanaCluster } from '../types';

const SOLANA_GENESIS_HASHES: Record<SolanaCluster, string> = {
  'mainnet-beta': '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
  devnet: 'GH7ome3EiwEr7tu9JuTh2dpYWBJK3z69Xm1ZE3MEE6JC',
  testnet: '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY',
};

/**
 * Checks if an RPC endpoint is connected to the required Solana cluster.
 * It fetches the genesis hash from the RPC endpoint and compares it
 * with a known hash for the specified cluster.
 *
 * @param {string} rpcUrl - The RPC endpoint URL to check.
 * @param {SolanaCluster} requiredCluster - The cluster that the transaction requires (e.g., 'mainnet-beta').
 * @throws {SolanaChainMismatchError} If the connected chain does not match the required cluster.
 * @throws {Error} If the cluster name is unknown or if the RPC call fails for other reasons.
 */
export const checkSolanaChain = async (rpcUrl: string, requiredCluster: SolanaCluster): Promise<void> => {
  const expectedGenesisHash = SOLANA_GENESIS_HASHES[requiredCluster];
  if (!expectedGenesisHash) {
    throw new Error(`Unknown Solana cluster specified: ${requiredCluster}`);
  }

  // Note: For optimal performance in a high-traffic app, the created RPC client could be cached.
  // However, for a one-off check like this, creating it on the fly is perfectly fine.
  const rpc = createSolanaRpc(rpcUrl);
  const currentGenesisHash = await rpc.getGenesisHash().send();

  if (currentGenesisHash !== expectedGenesisHash) {
    const currentClusterName =
      Object.entries(SOLANA_GENESIS_HASHES).find(([, hash]) => hash === currentGenesisHash)?.[0] ||
      'an unknown network';

    throw new SolanaChainMismatchError(requiredCluster, currentClusterName as SolanaCluster | string);
  }
};
