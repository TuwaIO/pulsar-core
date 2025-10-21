/**
 * @file This file contains a utility to verify the connected Solana chain.
 */

import { SolanaChainMismatchError } from '../errors';

/**
 * Checks if the wallet's current chain matches the required chain for a transaction.
 * This function compares the `chain` property from the Wallet Standard account object
 * with the required chain identifier (e.g., 'solana:mainnet').
 *
 * @param {string} requiredChain - The chain identifier that the transaction requires.
 * @param {string} currentChain - The chain identifier the wallet is currently connected to.
 * @throws {SolanaChainMismatchError} If the connected chain does not match the required chain.
 */
export const checkSolanaChain = (requiredChain: string, currentChain: string): void => {
  if (currentChain !== requiredChain) {
    throw new SolanaChainMismatchError(requiredChain, currentChain);
  }
};
