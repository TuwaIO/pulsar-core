/**
 * @file Unit tests for pulsarSolanaAdapter.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { TransactionTracker } from '@tuwaio/pulsar-core';
import { describe, expect, test } from 'vitest';

import { pulsarSolanaAdapter } from './solanaAdapter';

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
});
