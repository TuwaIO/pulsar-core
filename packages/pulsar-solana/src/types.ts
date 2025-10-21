/**
 * @file Defines the core types and enums specific to the @tuwaio/pulsar-solana package.
 */

import type { SolanaClusterMoniker } from 'gill';

/**
 * Represents the simplified configuration object for the Solana adapter.
 *
 * This configuration enables both wallet-based (connected) and read-only (disconnected) modes,
 * supporting operations like transaction tracking, name/identity resolution, and more.
 *
 * @property {Partial<Record<SolanaClusterMoniker, string>>} rpcUrls - A mapping of cluster names to their respective RPC endpoints.
 */
export interface SolanaAdapterConfig {
  rpcUrls: Partial<Record<SolanaClusterMoniker, string>>;
}
