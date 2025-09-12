// --- RPC Client Caching ---

import { createSolanaRpc, Rpc, SolanaRpcApi } from 'gill';

/**
 * An in-memory cache for RPC clients to avoid re-creating them on every poll.
 * @internal
 */
const rpcCache = new Map<string, Rpc<SolanaRpcApi>>();

/**
 * Retrieves a cached RPC client for a given URL or creates a new one.
 * @param rpcUrl - The RPC endpoint URL.
 * @returns The RPC client instance.
 * @internal
 */
export const createSolanaRPC = (rpcUrl: string): Rpc<SolanaRpcApi> => {
  if (rpcCache.has(rpcUrl)) {
    return rpcCache.get(rpcUrl)!;
  }
  const newRpc = createSolanaRpc(rpcUrl);
  rpcCache.set(rpcUrl, newRpc);
  return newRpc;
};
