/**
 * @file This file contains utility functions for interacting with the Ethereum Name Service (ENS).
 * It provides methods for resolving names to addresses, addresses to names, and fetching avatars.
 */

import { Address, Hex, isAddress } from 'viem';
import { mainnet } from 'viem/chains';
import { getEnsAddress, getEnsAvatar, getEnsName, normalize } from 'viem/ens';

import { createViemClient } from './createViemClient';

// Create a single, shared viem client for all ENS lookups to improve performance.
// ENS lookups are typically done against Ethereum Mainnet regardless of the connected chain.
const ensClient = createViemClient(mainnet.id, [mainnet]);

/**
 * Fetches the primary ENS name for a given Ethereum address.
 * Performs the lookup on Ethereum Mainnet.
 *
 * @param {Hex} address - The Ethereum address to look up.
 * @returns {Promise<string | undefined>} The ENS name if found, otherwise undefined.
 */
export const getName = async (address: Hex): Promise<string | undefined> => {
  if (!ensClient) return undefined;
  try {
    const name = await getEnsName(ensClient, { address });
    return name ?? undefined;
  } catch (error) {
    console.error('ENS name lookup error:', error);
    return undefined;
  }
};

/**
 * Fetches the avatar for a given ENS name.
 * Performs the lookup on Ethereum Mainnet.
 *
 * @param {string} name - The ENS name (e.g., 'vitalik.eth').
 * @returns {Promise<string | undefined>} The URL of the avatar image or undefined if an error occurs.
 */
export const getAvatar = async (name: string): Promise<string | undefined> => {
  if (!ensClient) return undefined;
  try {
    const avatarUrl = await getEnsAvatar(ensClient, { name: normalize(name) });
    return avatarUrl ?? undefined;
  } catch (error) {
    console.error('ENS avatar lookup error:', error);
    return undefined;
  }
};

/**
 * Fetches the Ethereum address associated with a given ENS name.
 * Performs the lookup on Ethereum Mainnet.
 *
 * @param {string} name - The ENS name to resolve (e.g., 'vitalik.eth').
 * @returns {Promise<Address | undefined>} The associated Ethereum address (lowercase) or undefined if not found.
 */
export const getAddress = async (name: string): Promise<Address | undefined> => {
  if (!ensClient) return undefined;
  try {
    const address = await getEnsAddress(ensClient, { name: normalize(name) });
    return address ? (address.toLocaleLowerCase() as Address) : undefined;
  } catch (error) {
    console.error('ENS address lookup error:', error);
    return undefined;
  }
};

/**
 * A simple heuristic to check if a string could be an ENS name.
 * It works by checking if the string is NOT a valid Ethereum address.
 *
 * @param {string} address - The string to check.
 * @returns {boolean} True if the string is not in a valid address format.
 */
export const isEnsName = (address: string): boolean => !isAddress(address);
