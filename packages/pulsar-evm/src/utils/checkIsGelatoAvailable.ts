/**
 * @file This file contains a utility to check if the Gelato Relay service is available for a specific chain.
 */

// --- In-memory cache to store the list of supported chains ---
let cachedRelayChainIds: number[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION_MS = 5 * 60 * 1000; // Cache the list for 5 minutes

/**
 * Checks if the Gelato Relay service supports a given chain ID.
 * The result is cached in memory for 5 minutes to avoid excessive network requests.
 *
 * @param {number} chainId - The chain identifier to check.
 * @returns {Promise<boolean>} True if Gelato supports the chain, false otherwise.
 */
export async function checkIsGelatoAvailable(chainId: number): Promise<boolean> {
  const now = Date.now();

  // 1. Check if a valid cache exists.
  if (cachedRelayChainIds && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION_MS) {
    return cachedRelayChainIds.includes(chainId);
  }

  // 2. If no valid cache, fetch from the API.
  try {
    const response = await fetch('https://relay.gelato.digital/relays/v2');
    if (!response.ok) {
      // Clear cache in case of a temporary API failure
      cachedRelayChainIds = null;
      cacheTimestamp = null;
      return false;
    }

    const data = (await response.json()) as { relays: string[] };
    const supportedChainIds = data.relays.map(Number);

    // 3. Update the cache.
    cachedRelayChainIds = supportedChainIds;
    cacheTimestamp = now;

    return supportedChainIds.includes(chainId);
  } catch (e) {
    console.error('Failed to check Gelato service availability:', e);
    // Clear cache on error
    cachedRelayChainIds = null;
    cacheTimestamp = null;
    return false;
  }
}
