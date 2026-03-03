/**
 * @file This file contains a utility to check if the Gelato Relay service is available for a specific chain.
 * It uses the authenticated Gelato RPC client to fetch relay capabilities and caches the result.
 */

import { Transport } from 'viem';

import { createGelatoClient } from './createGelatoClient';

// =================================================================================================
// 1. TYPES
// =================================================================================================

/**
 * Represents the per-chain capabilities returned by the Gelato `relayer_getCapabilities` RPC method.
 *
 * @property {string} feeCollector - The address of the fee collector contract on this chain.
 * @property {GelatoToken[]} tokens - The list of ERC-20 tokens accepted for fee payment on this chain.
 */
export type GelatoCapabilitiesByChain = {
  feeCollector: string;
  tokens: GelatoToken[];
};

/**
 * Represents a token accepted for fee payment by the Gelato Relay on a given chain.
 *
 * @property {string} address - The ERC-20 token contract address.
 * @property {number} decimals - The number of decimals for the token.
 */
export type GelatoToken = {
  address: string;
  decimals: number;
};

/**
 * A record of Gelato relay capabilities keyed by numeric chain ID.
 */
export type GelatoCapabilities = Record<number, GelatoCapabilitiesByChain>;

// =================================================================================================
// 2. CACHE
// =================================================================================================

/**
 * In-memory cache for Gelato relay capabilities, keyed by the API key used to fetch them.
 * The cache persists for the lifetime of the application (until page reload).
 */
const capabilitiesCache = new Map<string, GelatoCapabilities>();

// =================================================================================================
// 3. INTERNAL HELPERS
// =================================================================================================

/**
 * Fetches the Gelato relay capabilities from the RPC endpoint using the `relayer_getCapabilities` method.
 * The response is a record keyed by chain ID strings, which is normalized to numeric keys.
 *
 * @param {ReturnType<Transport>} client - A viem transport client configured for the Gelato API.
 * @returns {Promise<GelatoCapabilities>} The parsed capabilities record.
 * @throws {Error} If the RPC call fails or returns an unexpected response.
 */
async function fetchCapabilities(client: ReturnType<Transport>): Promise<GelatoCapabilities> {
  const result = (await client.request({
    method: 'relayer_getCapabilities' as string,
    params: [] as unknown[],
  })) as Record<string, GelatoCapabilitiesByChain>;

  // Normalize string chain ID keys to numbers.
  const capabilities: GelatoCapabilities = {};
  for (const [key, value] of Object.entries(result)) {
    capabilities[Number(key)] = value;
  }

  return capabilities;
}

/**
 * Retrieves the Gelato relay capabilities, using an in-memory cache to avoid redundant RPC calls.
 * The cache is keyed by `gelatoApiKey` and persists for the lifetime of the application.
 *
 * @param {string} gelatoApiKey - The Gelato API key used for authentication.
 * @returns {Promise<GelatoCapabilities>} The capabilities record, either from cache or freshly fetched.
 */
async function getCapabilities(gelatoApiKey: string): Promise<GelatoCapabilities> {
  const cached = capabilitiesCache.get(gelatoApiKey);
  if (cached) {
    return cached;
  }

  const client = createGelatoClient({ apiKey: gelatoApiKey });
  const capabilities = await fetchCapabilities(client);

  capabilitiesCache.set(gelatoApiKey, capabilities);

  return capabilities;
}

// =================================================================================================
// 4. PUBLIC API
// =================================================================================================

/**
 * Checks if the Gelato Relay service supports a given chain ID.
 *
 * This function fetches the relay capabilities via the authenticated Gelato RPC client
 * (`relayer_getCapabilities`) and checks whether the specified chain is present in the response.
 * Results are cached in memory per API key for the lifetime of the application to minimize network requests.
 *
 * @param {number} chainId - The chain identifier to check.
 * @param {string} gelatoApiKey - The Gelato API key used for authentication.
 * @returns {Promise<boolean>} A promise that resolves to `true` if Gelato supports the chain, `false` otherwise.
 */
export async function checkIsGelatoAvailable(chainId: number, gelatoApiKey: string): Promise<boolean> {
  try {
    const capabilities = await getCapabilities(gelatoApiKey);
    return chainId in capabilities;
  } catch (error) {
    console.error('Failed to fetch Gelato relay capabilities:', error);

    // Clear the cache for this key so the next call retries the request.
    capabilitiesCache.delete(gelatoApiKey);

    return false;
  }
}
