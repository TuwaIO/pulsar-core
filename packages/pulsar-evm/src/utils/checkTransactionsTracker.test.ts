/**
 * @file Unit tests for checkTransactionsTracker.
 */

import { TransactionTracker } from '@tuwaio/pulsar-core';
import { describe, expect, test } from 'vitest';

import { checkTransactionsTracker } from './checkTransactionsTracker';

describe('checkTransactionsTracker', () => {
  const mockTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

  test('should route to Gelato when tracker is Gelato and gelatoApiKey is provided', () => {
    const result = checkTransactionsTracker({
      actionTxKey: 'gelato-task-id-123',
      connectorType: 'injected',
      tracker: TransactionTracker.Gelato,
      gelatoApiKey: 'key-123',
    });

    expect(result).toEqual({
      tracker: TransactionTracker.Gelato,
      txKey: 'gelato-task-id-123',
    });
  });

  test('should route to ERC-4337 when tracker is ERC4337 and key is hex', () => {
    const result = checkTransactionsTracker({
      actionTxKey: mockTxHash,
      connectorType: 'smart-account',
      tracker: TransactionTracker.ERC4337,
    });

    expect(result).toEqual({
      tracker: TransactionTracker.ERC4337,
      txKey: mockTxHash,
    });
  });

  test('should route to Safe when connectorType indicates Safe wallet', () => {
    const result = checkTransactionsTracker({
      actionTxKey: mockTxHash,
      connectorType: 'safe',
    });

    expect(result).toEqual({
      tracker: TransactionTracker.Safe,
      txKey: mockTxHash,
    });
  });

  test('should default to Ethereum for standard EVM hash', () => {
    const result = checkTransactionsTracker({
      actionTxKey: mockTxHash,
      connectorType: 'metamask',
    });

    expect(result).toEqual({
      tracker: TransactionTracker.Ethereum,
      txKey: mockTxHash,
    });
  });

  test('should throw error if non-hex key is provided for non-Gelato tracker', () => {
    expect(() =>
      checkTransactionsTracker({
        actionTxKey: 'invalid-non-hex-key',
        connectorType: 'metamask',
      }),
    ).toThrow('Invalid transaction key format');
  });
});
