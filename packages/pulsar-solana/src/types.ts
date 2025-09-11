/**
 * @file Defines the core types and enums specific to the @tuwaio/pulsar-solana package.
 */

import { ConnectionContextState, WalletContextState } from '@solana/wallet-adapter-react';

/**
 * Defines the possible Solana network clusters.
 */
export type SolanaCluster = 'mainnet-beta' | 'devnet' | 'testnet';

/**
 * Configuration object for the `solanaAdapter`.
 * All properties are optional and are typically derived from the Solana wallet adapter hooks.
 *
 * @property {WalletContextState} [wallet] - The state object from `useWallet()`. Required for actions that need a connected wallet, like signing or retrying transactions.
 * @property {ConnectionContextState} [connection] - The state object from `useConnection()`. Required for on-chain operations like checking the network or using the Solana Name Service.
 * @property {string} [explorerUrl] - The base URL for the transaction explorer (e.g., "https://solscan.io"). Defaults to Solscan if not provided.
 * @property {SolanaCluster} [cluster] - The specific cluster the app is connected to. Used for generating correct explorer links.
 */
export interface SolanaAdapterConfig {
  wallet?: WalletContextState;
  connection?: ConnectionContextState;
  explorerUrl?: string;
  cluster?: SolanaCluster;
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
