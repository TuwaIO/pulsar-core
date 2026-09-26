/**
 * @file Types of the Solana adapter.
 */

import type { SolanaClusterMoniker } from '@tuwaio/orbit-solana';

/**
 * The configuration of {@link pulsarSolanaAdapter}.
 */
export interface SolanaAdapterConfig {
  /**
   * RPC URLs by cluster moniker (`mainnet`, `devnet`, `testnet`, `localnet`), used by `retryTxAction` when the
   * transaction has no `rpcUrl`. Clusters without a URL fall back to the public mainnet-beta endpoint.
   */
  rpcUrls: Partial<Record<SolanaClusterMoniker, string>>;
}
