/**
 * @file Defines the core types and enums specific to the @tuwaio/pulsar-solana package.
 */

import type { SolanaClusterMoniker } from 'gill';

/**
 * Describes the essential wallet information needed by the Solana adapter.
 * This simple, library-agnostic interface allows any wallet connection library
 * to be used with Pulsar, as long as it can provide this basic data.
 */
export interface SolanaAdapterWallet {
  walletAddress: string;
  walletType: string;
  walletActiveChain: SolanaClusterMoniker;
}

/**
 * The final, simplified configuration object for the solanaAdapter.
 *
 * @property {SolanaAdapterWallet} wallet - A simple object representing the current state of the user's wallet.
 * @property {Record<SolanaClusterMoniker, string>} rpcUrls - A map of RPC URLs for each supported Solana cluster.
 */
export interface SolanaAdapterConfig {
  wallet?: SolanaAdapterWallet;
  rpcUrls: Record<SolanaClusterMoniker, string>;
}

/**
 * Defines the tracker identifiers available in the Solana adapter.
 */
export enum SolanaTransactionTracker {
  /** The default tracker for monitoring standard Solana transaction signatures. */
  Solana = 'solana',
}

/**
 * Represents the unique key returned by a transaction-creating action on Solana.
 * For standard Solana transactions, this is always the transaction signature as a base58 string.
 */
export type SolanaActionTxKey = string;
