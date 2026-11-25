/**
 * @file Tests of the reads through the connected wallet's node, with the real viem over a scripted provider.
 */

import { Config } from '@wagmi/core';
import { Chain } from 'viem';
import { estimateFeesPerGas, getTransactionCount } from 'viem/actions';
import { sepolia } from 'viem/chains';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { hasNonceLanes, inTime, readThroughWallet } from './nodeReads';

const ADDRESS = '0xad9a211d227d2d9c1b5573f73cda0284b758ac0c';
const configOn = (chainId: number, getProvider: () => Promise<unknown>) =>
  ({ state: { connections: new Map([['uid', { chainId, connector: { getProvider } }]]) } }) as unknown as Config;

describe('readThroughWallet', () => {
  const request = vi.fn(async ({ method }: { method: string }) => {
    switch (method) {
      case 'eth_getBlockByNumber':
        return { baseFeePerGas: '0x3b9aca00', number: '0x1', timestamp: '0x1', transactions: [] };
      case 'eth_maxPriorityFeePerGas':
        return '0x5f5e100';
      case 'eth_getTransactionCount':
        return '0x65';
      default:
        throw new Error(`Asked for ${method}`);
    }
  });
  const config = configOn(sepolia.id, async () => ({ request }));

  beforeEach(() => {
    request.mockClear();
  });

  test('gives the market of the chain, from the provider of the wallet', async () => {
    const fees = await readThroughWallet(config, sepolia.id, (wallet) => estimateFeesPerGas(wallet), sepolia);

    // viem's own rule: 1.2 times the base fee, and the priority fee on top
    expect(fees).toMatchObject({ maxFeePerGas: 1_300_000_000n, maxPriorityFeePerGas: 100_000_000n });
  });

  test('gives the count of the sender', async () => {
    const read = (wallet: Parameters<typeof getTransactionCount>[0]) =>
      getTransactionCount(wallet, { address: ADDRESS, blockTag: 'latest' });

    expect(await readThroughWallet(config, sepolia.id, read)).toBe(101);
  });

  test('asks no wallet on another chain', async () => {
    expect(await readThroughWallet(config, 1, (wallet) => estimateFeesPerGas(wallet))).toBeUndefined();

    expect(request).not.toHaveBeenCalled();
  });

  test('is no answer on a config with no connections, as on a server', async () => {
    const read = vi.fn();

    expect(await readThroughWallet({} as Config, 1, read)).toBeUndefined();
    expect(read).not.toHaveBeenCalled();
  });

  describe('in time', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    test.each([
      ['never answers', async () => ({ request: () => new Promise(() => {}) })],
      ['never gives its provider', () => new Promise(() => {})],
    ])('leaves a wallet that %s after three seconds', async (_name, getProvider) => {
      const answered = vi.fn();
      void readThroughWallet(configOn(1, getProvider), 1, (wallet) => estimateFeesPerGas(wallet)).then(answered);

      await vi.advanceTimersByTimeAsync(2_900);
      expect(answered).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(200);
      expect(answered).toHaveBeenCalledWith(undefined);
    });

    test('keeps no timer once the node answered', async () => {
      await inTime(Promise.resolve(1));

      expect(vi.getTimerCount()).toBe(0);
    });
  });
});

describe('hasNonceLanes', () => {
  test('is true only on a chain whose transactions are replaced by a key of their own', () => {
    expect(hasNonceLanes(undefined)).toBe(false);
    expect(hasNonceLanes(sepolia)).toBe(false);
    expect(hasNonceLanes({ ...sepolia, transactionReplacement: { getKey: () => 'a' } } as unknown as Chain)).toBe(true);
  });
});
