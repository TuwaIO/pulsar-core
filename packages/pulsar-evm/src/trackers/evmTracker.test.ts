/**
 * @file Unit tests for the evmTracker function.
 * These tests mock the `viem/actions` module to simulate various transaction tracking scenarios
 * without interacting with a live network. This ensures tests are fast, reliable, and deterministic.
 */

import { createConfig } from '@wagmi/core';
import { createClient, Hex, http, TransactionReceipt, zeroAddress, zeroHash } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { evmTracker, EVMTrackerParams } from './evmTracker';

// Mock the entire 'viem/actions' module to control its behavior in tests.
vi.mock('viem/actions', async (importActual) => {
  const original = await importActual<typeof import('viem/actions')>();
  return {
    ...original,
    waitForTransactionReceipt: vi.fn(),
    getTransaction: vi.fn(),
  };
});

// We need to await the mocked module to get the mocked functions.
const { waitForTransactionReceipt, getTransaction } = await import('viem/actions');
const viemActions = {
  waitForTransactionReceipt: vi.mocked(waitForTransactionReceipt),
  getTransaction: vi.mocked(getTransaction),
};

describe('evmTracker Unit Tests', () => {
  let baseTrackerParams: EVMTrackerParams;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  let consoleErrorSpy: vi.SpyInstance;

  // A realistic mock for transaction details returned by `getTransaction`.
  const mockTxDetails = {
    hash: '0x0908f7a70a9f8acd9ced904f4e288bc46ae42923ce82bde706b26fdb8452abec' as Hex,
    // Add other necessary fields to satisfy the type
    nonce: 1,
    from: zeroAddress,
    to: zeroAddress,
    value: 0n,
    input: '0x' as Hex,
    // ... fill in other GetTransactionReturnType properties as needed
  } as const;

  beforeEach(() => {
    const config = createConfig({
      chains: [sepolia, mainnet],
      client({ chain }) {
        return createClient({ chain, transport: http() });
      },
    });
    // Reset params before each test to ensure isolation.
    baseTrackerParams = {
      onTxDetailsFetched: vi.fn(),
      onInitialize: vi.fn(),
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      onReplaced: vi.fn(),
      tx: {
        txKey: '0x0908f7a70a9f8acd9ced904f4e288bc46ae42923ce82bde706b26fdb8452abec',
        chainId: sepolia.id,
      },
      config,
    };

    // Mock successful transaction fetching by default.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    viemActions.getTransaction.mockResolvedValue(mockTxDetails);

    // Suppress console.error logs during tests for a cleaner output.
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clear all mocks and restore the console spy after each test.
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  test('should call onInitialize when the tracker starts', async () => {
    await evmTracker(baseTrackerParams);
    expect(baseTrackerParams.onInitialize).toHaveBeenCalledOnce();
  });

  test('should call onTxDetailsFetched with transaction details', async () => {
    await evmTracker(baseTrackerParams);
    expect(baseTrackerParams.onTxDetailsFetched).toHaveBeenCalledWith(mockTxDetails);
  });

  test('should call onSuccess for a successfully mined transaction', async () => {
    const mockReceipt = { status: 'success', transactionHash: baseTrackerParams.tx.txKey } as TransactionReceipt;
    viemActions.waitForTransactionReceipt.mockResolvedValue(mockReceipt);

    await evmTracker(baseTrackerParams);

    expect(baseTrackerParams.onSuccess).toHaveBeenCalledWith(mockTxDetails, mockReceipt, expect.anything());
    expect(baseTrackerParams.onFailure).not.toHaveBeenCalled();
  });

  test('should call onSuccess even for a reverted transaction', async () => {
    const mockReceipt = { status: 'reverted', transactionHash: baseTrackerParams.tx.txKey } as TransactionReceipt;
    viemActions.waitForTransactionReceipt.mockResolvedValue(mockReceipt);

    await evmTracker(baseTrackerParams);

    // `onSuccess` is called because the transaction was successfully mined, even if it reverted.
    // The status 'reverted' is handled within the callback.
    expect(baseTrackerParams.onSuccess).toHaveBeenCalledWith(mockTxDetails, mockReceipt, expect.anything());
    expect(baseTrackerParams.onFailure).not.toHaveBeenCalled();
  });

  test('should call onFailure if getTransaction rejects after all retries', async () => {
    const mockError = new Error('Transaction not found');
    viemActions.getTransaction.mockRejectedValue(mockError);

    await evmTracker({ ...baseTrackerParams, retryCount: 1, retryTimeout: 1 });

    expect(baseTrackerParams.onFailure).toHaveBeenCalledWith(mockError);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test('should call onFailure if the transaction hash is zeroHash', async () => {
    const paramsForZeroHash = {
      ...baseTrackerParams,
      tx: { ...baseTrackerParams.tx, txKey: zeroHash },
    };

    await evmTracker(paramsForZeroHash);

    expect(paramsForZeroHash.onFailure).toHaveBeenCalledWith(expect.any(Error));
    expect(viemActions.getTransaction).not.toHaveBeenCalled();
  });

  test('should call onReplaced and not onSuccess when a transaction is replaced', async () => {
    const replacementData = {
      reason: 'repriced' as const,
      transaction: { hash: '0xnewHash' as Hex },
    };

    // Simulate viem's behavior: onReplaced is called, then the promise resolves.
    viemActions.waitForTransactionReceipt.mockImplementation(async (_client, { onReplaced }) => {
      onReplaced?.(replacementData as any);
      // The promise resolves, but our tracker's internal flag prevents onSuccess from being called.
      return { status: 'success' } as TransactionReceipt;
    });

    await evmTracker(baseTrackerParams);

    expect(baseTrackerParams.onReplaced).toHaveBeenCalledTimes(1);
    expect(baseTrackerParams.onReplaced).toHaveBeenCalledWith(replacementData);
    expect(baseTrackerParams.onSuccess).not.toHaveBeenCalled();
  });
});
