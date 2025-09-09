/**
 * @file This file contains a utility for safely retrieving the active wallet account and the viem wallet client from wagmi.
 */

import { Config, getClient, GetClientReturnType } from '@wagmi/core';
import { getAccount as getWagmiAccount, GetAccountReturnType } from '@wagmi/core';

/**
 * Retrieves the active wallet account and the viem Wallet Client from the wagmi config.
 * This function acts as a safeguard, ensuring that a wallet is connected before
 * attempting any on-chain actions.
 *
 * @param {Config} config - The wagmi configuration object.
 *
 * @returns {{ activeWallet: GetAccountReturnType; walletClient: NonNullable<GetClientReturnType> }}
 * An object containing the connected account details and the viem Wallet Client.
 * The return types are guaranteed to be non-nullable.
 *
 * @throws {Error} Throws an error if the wallet is not connected, the address is missing,
 * or the viem client is unavailable.
 */
export function getActiveWalletAndClient(config: Config): {
  activeWallet: GetAccountReturnType;
  walletClient: NonNullable<GetClientReturnType>;
} {
  const activeWallet = getWagmiAccount(config);
  const walletClient = getClient(config);

  // This check is a crucial guard clause to prevent downstream errors.
  if (!activeWallet.address) {
    throw new Error('getActiveWalletAndClient failed: No connected wallet address found.');
  }

  if (!walletClient) {
    throw new Error('getActiveWalletAndClient failed: Wallet client is unavailable.');
  }

  return { activeWallet, walletClient };
}
