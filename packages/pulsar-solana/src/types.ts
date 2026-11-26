/**
 * @file Types of the Solana adapter.
 */

import type { SolanaClusterMoniker, SolanaRpcUrl } from '@tuwaio/orbit-solana';

/**
 * The configuration of {@link pulsarSolanaAdapter}.
 */
export interface SolanaAdapterConfig {
  /**
   * RPC URLs by cluster moniker (`mainnet`, `devnet`, `testnet`, `localnet`), one or several a cluster, the one source
   * of the tracker's and `retryTxAction`'s endpoint. A read goes to the next URL of a cluster when one does not answer.
   * A cluster without a URL uses its public endpoint.
   */
  rpcUrls: Partial<Record<SolanaClusterMoniker, SolanaRpcUrl>>;
}
