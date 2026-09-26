/**
 * @file Unit tests for the explorer links of `pulsarEvmAdapter`.
 */

import { type Config } from '@wagmi/core';
import { type Chain } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { pulsarEvmAdapter } from './evmAdapter';

const getConnection = vi.fn();

vi.mock('@wagmi/core', async (importActual) => {
  const original = await importActual<typeof import('@wagmi/core')>();
  return { ...original, getConnection: (...args: unknown[]) => getConnection(...args) };
});

const noExplorerChain = { ...sepolia, id: 999_999, blockExplorers: undefined } as unknown as Chain;
const adapter = pulsarEvmAdapter({} as Config, [mainnet, sepolia, noExplorerChain]);

describe('pulsarEvmAdapter.getExplorerUrl', () => {
  beforeEach(() => {
    getConnection.mockReturnValue({ chain: mainnet });
  });

  test('uses the chain of chainId when it is passed', () => {
    expect(adapter.getExplorerUrl('/address/0x1', sepolia.id)).toBe('https://sepolia.etherscan.io/address/0x1');
  });

  test('uses the connected chain when chainId is omitted, without a double slash', () => {
    expect(adapter.getExplorerUrl('tx/0x1')).toBe('https://etherscan.io/tx/0x1');
    expect(adapter.getExplorerUrl('/tx/0x1')).toBe('https://etherscan.io/tx/0x1');
    expect(adapter.getExplorerUrl()).toBe('https://etherscan.io');
  });

  test('returns undefined when the chain has no block explorer', () => {
    expect(adapter.getExplorerUrl('/tx/0x1', noExplorerChain.id)).toBeUndefined();
    getConnection.mockReturnValue({ chain: undefined });
    expect(adapter.getExplorerUrl('/tx/0x1')).toBeUndefined();
  });
});
