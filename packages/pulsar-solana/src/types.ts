/**
 * @file Defines the core types and enums specific to the @tuwaio/pulsar-solana package.
 */

import type { SolanaClusterMoniker } from 'gill';

/**
 * Represents the essential wallet information required by the Solana adapter.
 * This interface provides a simple, library-agnostic abstraction for wallet connections,
 * enabling integration with any wallet library that meets these basic requirements.
 *
 * @property {string} walletAddress - The public address of the connected wallet on Solana.
 * @property {string} walletType - The type or name of the wallet (e.g., 'Phantom', 'Solflare').
 * @property {SolanaClusterMoniker} walletActiveChain - The current chain or cluster the wallet is connected to.
 */
export interface SolanaAdapterWallet {
  walletAddress: string;
  walletType: string;
  walletActiveChain: SolanaClusterMoniker;
}

/**
 * Represents the simplified configuration object for the Solana adapter.
 *
 * This configuration enables both wallet-based (connected) and read-only (disconnected) modes,
 * supporting operations like transaction tracking, name/identity resolution, and more.
 *
 * @property {SolanaAdapterWallet} [wallet] - An optional object describing the connected wallet's state.
 * @property {Partial<Record<SolanaClusterMoniker, string>>} rpcUrls - A mapping of cluster names to their respective RPC endpoints.
 */
export interface SolanaAdapterConfig {
  wallet?: SolanaAdapterWallet;
  rpcUrls: Partial<Record<SolanaClusterMoniker, string>>;
}
