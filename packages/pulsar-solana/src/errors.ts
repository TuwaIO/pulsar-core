/**
 * @file This file defines custom error classes for the @tuwaio/pulsar-solana package.
 */

/**
 * Thrown when the connected Solana chain does not match the required chain for a transaction.
 *
 * This allows consuming applications to `catch` this specific error and
 * implement custom logic, such as prompting the user to switch networks.
 */
export class SolanaChainMismatchError extends Error {
  /** The name of the error, for easy identification. */
  name = 'SolanaChainMismatchError';
  /** The chain that the transaction requires (e.g., 'solana:mainnet'). */
  requiredChain: string;
  /** The chain the wallet is currently connected to. */
  currentChain: string;

  constructor(requiredChain: string, currentChain: string) {
    const message = `Wrong chain. The transaction requires ${requiredChain}, but you are connected to ${currentChain}.`;
    super(message);
    this.requiredChain = requiredChain;
    this.currentChain = currentChain;
  }
}
