/**
 * @file Unit tests for pulsarSolanaAdapter.
 */

import { lastConnectedConnectorHelpers, OrbitAdapter } from '@tuwaio/orbit-core';
import { TransactionTracker } from '@tuwaio/pulsar-core';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { SolanaChainMismatchError } from '../errors';
import { pulsarSolanaAdapter } from './solanaAdapter';

vi.mock('@tuwaio/orbit-solana', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/orbit-solana')>();
  return { ...original, getConnectedSolanaConnector: vi.fn(() => ({ name: 'Phantom', accounts: [] })) };
});

describe('pulsarSolanaAdapter', () => {
  const adapter = pulsarSolanaAdapter({
    rpcUrls: {
      devnet: 'https://api.devnet.solana.com',
    },
  });

  test('should have key OrbitAdapter.SOLANA', () => {
    expect(adapter.key).toBe(OrbitAdapter.SOLANA);
  });

  test('checkTransactionsTracker should return default Solana tracker if none specified', () => {
    const result = adapter.checkTransactionsTracker({
      actionTxKey: '5U3b...sig',
      connectorType: 'phantom',
    });

    expect(result).toEqual({
      tracker: TransactionTracker.Solana,
      txKey: '5U3b...sig',
    });
  });

  test('getExplorerUrl should format solana explorer url', () => {
    const url = adapter.getExplorerUrl('5U3b...sig', 'solana:devnet');
    expect(typeof url).toBe('string');
    expect(url).toContain('solana.com');
  });

  describe('checkChainForTx', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    const connectTo = (chainId: string) =>
      vi
        .spyOn(lastConnectedConnectorHelpers, 'getLastConnectedConnector')
        .mockReturnValue({ connectorType: 'solana:phantom', chainId, address: 'Addr' });

    test('accepts the same cluster with or without the solana: prefix', async () => {
      connectTo('devnet');
      await expect(adapter.checkChainForTx('devnet')).resolves.toBeUndefined();
      await expect(adapter.checkChainForTx('solana:devnet')).resolves.toBeUndefined();

      connectTo('solana:devnet');
      await expect(adapter.checkChainForTx('devnet')).resolves.toBeUndefined();
    });

    test('accepts the genesis-hash chain ID and mainnet-beta of the connected cluster', async () => {
      connectTo('devnet');
      await expect(adapter.checkChainForTx('solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1')).resolves.toBeUndefined();

      connectTo('mainnet');
      await expect(adapter.checkChainForTx('solana:mainnet-beta')).resolves.toBeUndefined();
      await expect(adapter.checkChainForTx('solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp')).resolves.toBeUndefined();
    });

    test('rejects the genesis-hash chain ID of another cluster', async () => {
      connectTo('mainnet');
      await expect(adapter.checkChainForTx('solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1')).rejects.toMatchObject({
        requiredChain: 'devnet',
        currentChain: 'mainnet',
      });
    });

    test('rejects when the connection has no saved chain instead of assuming mainnet', async () => {
      connectTo('');
      await expect(adapter.checkChainForTx('mainnet')).rejects.toBeInstanceOf(SolanaChainMismatchError);
    });

    test('rejects another cluster with SolanaChainMismatchError', async () => {
      connectTo('mainnet');
      await expect(adapter.checkChainForTx('solana:devnet')).rejects.toBeInstanceOf(SolanaChainMismatchError);
    });
  });
});
