/**
 * @file This file contains a utility function for generating Solana transaction explorer links.
 */

import { SolanaCluster } from '../types';

/**
 * Generates a full URL to a transaction on a Solana explorer like Solscan.
 *
 * @param {string} baseUrl - The base URL of the explorer (e.g., "https://solscan.io").
 * @param {string} txKey - The transaction signature (hash).
 * @param {SolanaCluster} [cluster] - The optional cluster name ('devnet', 'testnet') to add as a query parameter.
 * @returns {string} The full URL to the transaction on the explorer.
 */
export const selectSolanaTxExplorerLink = (baseUrl: string, txKey: string, cluster?: SolanaCluster): string => {
  // Ensure there are no trailing slashes on the base URL for clean URL construction.
  const sanitizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  // Build the cluster query parameter if provided.
  const clusterParam = cluster ? `?cluster=${cluster}` : '';

  return `${sanitizedBaseUrl}/tx/${txKey}${clusterParam}`;
};
