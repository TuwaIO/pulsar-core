/**
 * @file Checks whether Gelato Relay supports a chain, using the `relayer_getCapabilities` RPC method.
 */

import { Transport } from 'viem';

import { createGelatoClient } from './createGelatoClient';

// =================================================================================================
// 1. TYPES
// =================================================================================================

/**
 * The Gelato Relay capabilities of one chain, as returned by `relayer_getCapabilities`.
 *
 * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.
 */
export type GelatoCapabilitiesByChain = {
  /** The address of the fee collector contract on this chain. */
  feeCollector: string;
  /** The ERC-20 tokens accepted for fee payment on this chain. */
  tokens: GelatoToken[];
};

/**
 * A token accepted for fee payment by Gelato Relay.
 *
 * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.
 */
export type GelatoToken = {
  /** The ERC-20 token contract address. */
  address: string;
  /** The number of decimals of the token. */
  decimals: number;
};

/**
 * Gelato Relay capabilities by numeric chain ID.
 *
 * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.
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
 * Checks whether Gelato Relay supports a chain.
 *
 * Side effects: the first call for an API key sends `relayer_getCapabilities` to the Gelato API (see
 * {@link createGelatoClient}); the result is cached in memory per API key until the page is reloaded. A failed request
 * is logged, is not cached, and returns `false`.
 *
 * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.
 * @param chainId - The chain ID to check.
 * @param gelatoApiKey - The Gelato API key.
 * @returns `true` if the chain is supported; `false` if it is not or the request failed. Never rejects.
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
