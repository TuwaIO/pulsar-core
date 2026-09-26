/**
 * @file Errors thrown by the Solana adapter.
 */

/**
 * Thrown by {@link checkSolanaChain} (and so by `executeTxAction` through the Solana adapter) when the wallet is
 * connected to another cluster than the transaction requires. Catch it to ask the user to switch networks.
 */
export class SolanaChainMismatchError extends Error {
  /** Always `'SolanaChainMismatchError'`. */
  name = 'SolanaChainMismatchError';
  /** The cluster the transaction requires, for example `devnet`. */
  requiredChain: string;
  /** The cluster the wallet is connected to. */
  currentChain: string;

  /**
   * @param requiredChain - The cluster the transaction requires.
   * @param currentChain - The cluster the wallet is connected to.
   */
  constructor(requiredChain: string, currentChain: string) {
    const message = `Wrong chain. The transaction requires ${requiredChain}, but you are connected to ${currentChain}.`;
    super(message);
    this.requiredChain = requiredChain;
    this.currentChain = currentChain;
  }
}
