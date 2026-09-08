/**
 * @file Unit tests for checkSolanaChain.
 */

import { describe, expect, test } from 'vitest';

import { SolanaChainMismatchError } from '../errors';
import { checkSolanaChain } from './checkSolanaChain';

describe('checkSolanaChain', () => {
  test('should pass without error when chains match', () => {
    expect(() => checkSolanaChain('solana:mainnet', 'solana:mainnet')).not.toThrow();
  });

  test('should throw SolanaChainMismatchError when chains do not match', () => {
    expect(() => checkSolanaChain('solana:mainnet', 'solana:devnet')).toThrow(SolanaChainMismatchError);
  });

  test('error should contain required and current chain details', () => {
    try {
      checkSolanaChain('solana:mainnet', 'solana:devnet');
    } catch (e) {
      expect(e).toBeInstanceOf(SolanaChainMismatchError);
      const err = e as SolanaChainMismatchError;
      expect(err.requiredChain).toBe('solana:mainnet');
      expect(err.currentChain).toBe('solana:devnet');
      expect(err.message).toContain('Wrong chain');
    }
  });
});
