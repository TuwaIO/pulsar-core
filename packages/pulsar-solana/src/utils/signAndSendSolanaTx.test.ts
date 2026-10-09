/**
 * @file Unit tests for signAndSendSolanaTx.
 */

import type { Instruction, TransactionSendingSigner } from '@solana/kit';
import type { SolanaClient } from '@tuwaio/orbit-solana';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { signAndSendSolanaTx } from './signAndSendSolanaTx';
import { takeSolanaTxLifetime } from './solanaTxLifetimes';

// Mock @solana/kit functions
const mockSignAndSend = vi.fn();
vi.mock('@solana/kit', async (importActual) => {
  const original = await importActual<typeof import('@solana/kit')>();
  return {
    ...original,
    signAndSendTransactionMessageWithSigners: (...args: unknown[]) => mockSignAndSend(...args),
  };
});

describe('signAndSendSolanaTx', () => {
  let mockClient: SolanaClient;
  let mockSigner: TransactionSendingSigner;
  let mockInstruction: Instruction;

  beforeEach(() => {
    vi.clearAllMocks();

    mockClient = {
      rpc: {
        getLatestBlockhash: () => ({
          send: vi.fn().mockResolvedValue({
            value: {
              blockhash: '4uQeVj5tqViQh7yWWGStvkEG1Zmhx6uasJtWCJziofM',
              lastValidBlockHeight: 12345n,
            },
          }),
        }),
      },
    } as unknown as SolanaClient;

    mockSigner = {
      address: '11111111111111111111111111111111' as unknown,
    } as TransactionSendingSigner;

    mockInstruction = {
      programAddress: '11111111111111111111111111111111' as unknown,
      accounts: [],
      data: new Uint8Array(),
    } as unknown as Instruction;
  });

  test('should fetch blockhash, sign and send transaction and return base58 signature', async () => {
    // 64-byte signature Uint8Array
    const mockSigBytes = new Uint8Array(64).fill(7);
    mockSignAndSend.mockResolvedValueOnce(mockSigBytes);

    const signature = await signAndSendSolanaTx({
      client: mockClient,
      signer: mockSigner,
      instruction: mockInstruction,
    });

    expect(mockSignAndSend).toHaveBeenCalled();
    expect(typeof signature).toBe('string');
    expect(signature.length).toBeGreaterThan(0);
  });

  test('should accept an array of instructions', async () => {
    const mockSigBytes = new Uint8Array(64).fill(9);
    mockSignAndSend.mockResolvedValueOnce(mockSigBytes);

    const signature = await signAndSendSolanaTx({
      client: mockClient,
      signer: mockSigner,
      instruction: [mockInstruction, mockInstruction],
    });

    expect(mockSignAndSend).toHaveBeenCalled();
    expect(typeof signature).toBe('string');
  });

  test('should propagate error if fetching blockhash fails', async () => {
    mockClient = {
      rpc: {
        getLatestBlockhash: () => ({
          send: vi.fn().mockRejectedValue(new Error('RPC blockhash failure')),
        }),
      },
    } as unknown as SolanaClient;

    await expect(
      signAndSendSolanaTx({
        client: mockClient,
        signer: mockSigner,
        instruction: mockInstruction,
      }),
    ).rejects.toThrow('RPC blockhash failure');
  });

  test('remembers the last valid block height of the blockhash for the tracker', async () => {
    mockSignAndSend.mockResolvedValueOnce(new Uint8Array(64).fill(5));

    const signature = await signAndSendSolanaTx({
      client: mockClient,
      signer: mockSigner,
      instruction: mockInstruction,
    });

    expect(takeSolanaTxLifetime(signature)).toBe(12345);
    expect(takeSolanaTxLifetime(signature)).toBeUndefined(); // taken once
  });
});
