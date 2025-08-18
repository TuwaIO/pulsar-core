/**
 * @file This file contains a utility to ensure the user's wallet is connected to the correct chain before proceeding.
 */

import { Config, switchChain } from '@wagmi/core';
import { getAccount } from '@wagmi/core';

/**
 * Checks if the user's wallet is connected to the specified chain. If not, it prompts
 * the user to switch to the correct chain and waits for the operation to complete.
 *
 * @param {number} chainId - The ID of the desired blockchain network.
 * @param {Config} config - The wagmi configuration object.
 * @returns {Promise<void>} A promise that resolves when the wallet is on the correct chain,
 * or rejects if the user cancels the switch or an error occurs.
 * @throws {Error} Throws an error if the user rejects the chain switch or if the switch fails.
 */
export async function checkChainForTx(chainId: number, config: Config): Promise<void> {
  const { connector, chainId: activeChainId } = getAccount(config);

  // Proceed only if a wallet is connected and it's on the wrong chain.
  if (connector && activeChainId !== chainId) {
    try {
      // Directly await the switchChain call. This pauses execution until the user responds.
      await switchChain(config, { chainId });
    } catch (e) {
      // The user rejected the request or an error occurred.
      console.error('Failed to switch chain:', e);
      throw new Error('User rejected chain switch or an error occurred.');
    }
  }
}
