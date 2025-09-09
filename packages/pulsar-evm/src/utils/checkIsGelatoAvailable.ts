/**
 * @file This file contains a utility to check if the Gelato Relay service is available for a specific chain.
 */

// --- In-memory cache to store the list of supported chains ---
let cachedRelayChainIds: number[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION_MS = 5 * 60 * 1000; // Cache the list for 5 minutes
const GELATO_API_URL = 'https://relay.gelato.digital/relays/v2/supported-chains';

/**
 * Checks if the Gelato Relay service supports a given chain ID.
 *
 * This function fetches the list of supported chain IDs from the Gelato API and
 * caches the result in memory for 5 minutes to reduce network requests.
 *
 * @param {number} chainId - The chain identifier to check.
 * @returns {Promise<boolean>} A promise that resolves to `true` if Gelato supports the chain, `false` otherwise.
 */
export async function checkIsGelatoAvailable(chainId: number): Promise<boolean> {
  const now = Date.now();

  // 1. Check if a valid, non-expired cache exists.
  if (cachedRelayChainIds && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION_MS) {
    return cachedRelayChainIds.includes(chainId);
  }

  // 2. If no valid cache, fetch the list from the Gelato API.
  try {
    const response = await fetch(GELATO_API_URL);

    if (!response.ok) {
      throw new Error(`Gelato API responded with status: ${response.status}`);
    }

    const data = (await response.json()) as { chains: string[] };
    // The endpoint returns an array of strings, which we convert to numbers.
    const supportedChainIds = data.chains.map(Number);

    // 3. Update the cache with the new data and timestamp.
    cachedRelayChainIds = supportedChainIds;
    cacheTimestamp = now;

    return supportedChainIds.includes(chainId);
  } catch (error) {
    console.error('Failed to fetch Gelato supported chains:', error);

    // In case of an error, clear the cache to allow for a retry on the next call.
    cachedRelayChainIds = null;
    cacheTimestamp = null;

    return false;
  }
}
