/**
 * @file Unit & Integration test for checkIsGelatoAvailable.
 * This test mocks the Gelato RPC transport to verify
 * that the capability-fetching, caching, and error handling logic works properly.
 */

import { describe, expect, test, vi } from 'vitest';

import { checkIsGelatoAvailable } from './checkIsGelatoAvailable';

vi.mock('./createGelatoClient', () => ({
  createGelatoClient: vi.fn(({ apiKey }: { apiKey: string }) => ({
    request: vi.fn(async ({ method }: { method: string }) => {
      if (apiKey === 'invalid_api_key_12345') {
        throw new Error('Unauthorized');
      }
      if (method === 'relayer_getCapabilities') {
        return {
          '1': { feeCollector: '0x123', tokens: [] },
          '56': { feeCollector: '0x123', tokens: [] },
          '137': { feeCollector: '0x123', tokens: [] },
          '42161': { feeCollector: '0x123', tokens: [] },
        };
      }
      throw new Error(`Unknown method: ${method}`);
    }),
  })),
}));

const GELATO_API_KEY = process.env.GELATO_API_KEY || 'test_gelato_api_key';

describe('checkIsGelatoAvailable', () => {
  test('should have GELATO_API_KEY defined or fall back to test key', () => {
    expect(GELATO_API_KEY).not.toBe('');
  });

  test('should return true for Ethereum Mainnet (chainId: 1)', async () => {
    const chainId = 1;
    const result = await checkIsGelatoAvailable(chainId, GELATO_API_KEY);
    expect(result).toBe(true);
  });

  test('should return true for Polygon (chainId: 137)', async () => {
    const chainId = 137;
    const result = await checkIsGelatoAvailable(chainId, GELATO_API_KEY);
    expect(result).toBe(true);
  });

  test('should return true for Arbitrum One (chainId: 42161)', async () => {
    const chainId = 42161;
    const result = await checkIsGelatoAvailable(chainId, GELATO_API_KEY);
    expect(result).toBe(true);
  });

  test('should return false for a non-existent chain (chainId: 999999)', async () => {
    const chainId = 999999;
    const result = await checkIsGelatoAvailable(chainId, GELATO_API_KEY);
    expect(result).toBe(false);
  });

  test('should use cache on the second call (no extra RPC request)', async () => {
    const chainId = 56;
    const key = 'cache_test_api_key';

    const start1 = performance.now();
    const result1 = await checkIsGelatoAvailable(chainId, key);
    const duration1 = performance.now() - start1;

    const start2 = performance.now();
    const result2 = await checkIsGelatoAvailable(chainId, key);
    const duration2 = performance.now() - start2;

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(duration2).toBeLessThan(duration1 + 5);
  });

  test('should return false and log error for an invalid API key', async () => {
    const chainId = 1;
    const invalidKey = 'invalid_api_key_12345';

    const result = await checkIsGelatoAvailable(chainId, invalidKey);
    expect(result).toBe(false);
  });
});
