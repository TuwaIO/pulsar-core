/**
 * @file This file contains a utility for safely retrieving the active wallet account and viem client.
 */

import { Config, getClient, GetClientReturnType } from '@wagmi/core';
import { getAccount as getWagmiAccount, GetAccountReturnType } from '@wagmi/core';

/**
 * Retrieves the active wallet account and the viem Wallet Client from the wagmi config.
 * It ensures that a wallet is connected by throwing an error if it's not.
 *
 * @param {Config} config - The wagmi configuration object.
 * @returns {{ activeWallet: GetAccountReturnType; walletClient: GetClientReturnType }} An object containing the connected account details and the viem Wallet Client.
 * @throws {Error} Throws an error with the message "Wallet not connected" if no wallet is connected or the client is unavailable.
 */
export function getActiveWalletAndClient(config: Config): {
  activeWallet: GetAccountReturnType;
  walletClient: GetClientReturnType;
} {
  const activeWallet = getWagmiAccount(config);
  const walletClient = getClient(config);

  // This check is crucial to prevent downstream errors.
  if (!activeWallet.address || !walletClient) {
    throw new Error('Wallet not connected');
  }

  return { activeWallet, walletClient };
}
