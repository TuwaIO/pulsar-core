/**
 * @file Compares the cluster of a transaction with the cluster of the connected wallet.
 */

import { SolanaChainMismatchError } from '../errors';

/**
 * Checks that two cluster identifiers are equal. The comparison is exact, so pass both in the same format: the Solana
 * adapter removes a `solana:` prefix from `desiredChainID` and from the cluster saved for the connection before calling
 * it, so `devnet` and `solana:devnet` match there.
 *
 * @param requiredChain - The cluster the transaction requires.
 * @param currentChain - The cluster the wallet is connected to.
 * @throws {@link SolanaChainMismatchError} when they differ.
 */
export const checkSolanaChain = (requiredChain: string, currentChain: string): void => {
  if (currentChain !== requiredChain) {
    throw new SolanaChainMismatchError(requiredChain, currentChain);
  }
};
