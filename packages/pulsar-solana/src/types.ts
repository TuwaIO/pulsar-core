/**
 * @file Types of the Solana adapter.
 */

import type { SolanaClusterMoniker } from '@tuwaio/orbit-solana';

/**
 * The configuration of {@link pulsarSolanaAdapter}.
 */
export interface SolanaAdapterConfig {
  /**
   * RPC URLs by cluster moniker (`mainnet`, `devnet`, `testnet`, `localnet`), the one source of the tracker's and
   * `retryTxAction`'s endpoint. A cluster without a URL uses its public endpoint.
   */
  rpcUrls: Partial<Record<SolanaClusterMoniker, string>>;
}
