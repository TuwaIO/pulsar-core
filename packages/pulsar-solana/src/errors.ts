/**
 * @file This file defines custom error classes for the @tuwaio/pulsar-solana package.
 */

import { SolanaCluster } from './types';

/**
 * Thrown when the connected Solana cluster does not match the required cluster for a transaction.
 *
 * This allows consuming applications to `catch` this specific error and
 * implement custom logic, such as prompting the user to switch networks.
 */
export class SolanaChainMismatchError extends Error {
  /** The name of the error, for easy identification. */
  name = 'SolanaChainMismatchError';
  /** The cluster that the transaction requires (e.g., 'mainnet-beta'). */
  requiredCluster: SolanaCluster;
  /** The cluster the wallet is currently connected to. */
  currentCluster: SolanaCluster | string;

  constructor(requiredCluster: SolanaCluster, currentCluster: SolanaCluster | string) {
    const message = `Wrong network. The transaction requires ${requiredCluster}, but you are connected to ${currentCluster}.`;
    super(message);
    this.requiredCluster = requiredCluster;
    this.currentCluster = currentCluster;
  }
}
