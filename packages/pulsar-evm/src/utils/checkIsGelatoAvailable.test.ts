/**
 * @file Integration test for checkIsGelatoAvailable.
 * This test performs a real RPC call to the Gelato API to verify
 * that the capability-fetching and caching logic works end-to-end.
 *
 * Requires GELATO_API_KEY to be set in the root .env file.
 * Run with: npx vitest run packages/pulsar-evm/src/utils/checkIsGelatoAvailable.test.ts
 */

import { describe, expect, test } from 'vitest';

import { checkIsGelatoAvailable } from './checkIsGelatoAvailable';

const GELATO_API_KEY = process.env.GELATO_API_KEY ?? '';

describe('checkIsGelatoAvailable (integration)', () => {
  test('should have GELATO_API_KEY defined in environment', () => {
    console.log(`[checkIsGelatoAvailable] GELATO_API_KEY is ${GELATO_API_KEY ? 'set ✓' : 'MISSING ✗'}`);
    expect(GELATO_API_KEY).not.toBe('');
  });

  test('should return true for Ethereum Mainnet (chainId: 1)', async () => {
    const chainId = 1;
    const result = await checkIsGelatoAvailable(chainId, GELATO_API_KEY);

    console.log(`[checkIsGelatoAvailable] chainId=${chainId} => ${result}`);
    expect(result).toBe(true);
  });

  test('should return true for Polygon (chainId: 137)', async () => {
    const chainId = 137;
    const result = await checkIsGelatoAvailable(chainId, GELATO_API_KEY);

    console.log(`[checkIsGelatoAvailable] chainId=${chainId} => ${result}`);
    expect(result).toBe(true);
  });

  test('should return true for Arbitrum One (chainId: 42161)', async () => {
    const chainId = 42161;
    const result = await checkIsGelatoAvailable(chainId, GELATO_API_KEY);

    console.log(`[checkIsGelatoAvailable] chainId=${chainId} => ${result}`);
    expect(result).toBe(true);
  });

  test('should return false for a non-existent chain (chainId: 999999)', async () => {
    const chainId = 999999;
    const result = await checkIsGelatoAvailable(chainId, GELATO_API_KEY);

    console.log(`[checkIsGelatoAvailable] chainId=${chainId} => ${result}`);
    expect(result).toBe(false);
  });

  test('should use cache on the second call (no extra RPC request)', async () => {
    // Use a unique API key variant to ensure we start with a cold cache for this test.
    // Since previous tests already warmed the cache for GELATO_API_KEY,
    // we measure with a fresh chainId lookup instead — the key insight is that
    // the first call in THIS test will already be cached from the tests above,
    // so both calls should be fast. We verify by measuring absolute time.
    const chainId = 56; // BNB Chain — not used in previous tests
    const uncachedKey = GELATO_API_KEY;

    // First call — may or may not hit the network (cache was populated by previous tests for this key).
    const start1 = performance.now();
    const result1 = await checkIsGelatoAvailable(chainId, uncachedKey);
    const duration1 = performance.now() - start1;

    // Second call — guaranteed to come from cache.
    const start2 = performance.now();
    const result2 = await checkIsGelatoAvailable(chainId, uncachedKey);
    const duration2 = performance.now() - start2;

    console.log(`[checkIsGelatoAvailable] First call:  chainId=${chainId} => ${result1} (${duration1.toFixed(2)}ms)`);
    console.log(`[checkIsGelatoAvailable] Second call: chainId=${chainId} => ${result2} (${duration2.toFixed(2)}ms)`);

    expect(result1).toBe(result2);
    // The cached call should resolve in under 1ms since it's a simple Map lookup.
    expect(duration2).toBeLessThan(1);
  });

  test('should return false and log error for an invalid API key', async () => {
    const chainId = 1;
    const invalidKey = 'invalid_api_key_12345';

    const result = await checkIsGelatoAvailable(chainId, invalidKey);

    console.log(`[checkIsGelatoAvailable] Invalid API key => ${result}`);
    expect(result).toBe(false);
  });
});
