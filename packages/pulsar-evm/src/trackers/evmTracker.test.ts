/**
 * @file Unit tests for the evmTracker function.
 * These tests mock the viem/actions module to simulate various transaction tracking scenarios
 * without interacting with a live network. This ensures tests are fast, reliable, and deterministic.
 */

import { Hex, zeroAddress, zeroHash } from 'viem';
import { sepolia } from 'viem/chains';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { evmTracker, EVMTrackerParams } from './evmTracker';

// Mock the 'viem/actions' module
vi.mock('viem/actions', async (importActual) => {
  const original = await importActual<typeof import('viem/actions')>();
  return {
    ...original,
    waitForTransactionReceipt: vi.fn(),
    getTransaction: vi.fn(),
  };
});

const { waitForTransactionReceipt, getTransaction } = await import('viem/actions');
const viemActions = {
  waitForTransactionReceipt: vi.mocked(waitForTransactionReceipt),
  getTransaction: vi.mocked(getTransaction),
};

describe('evmTracker Unit Tests', () => {
  let evmTrackerParams: EVMTrackerParams;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  let consoleErrorSpy: vi.SpyInstance;

  const mockTxDetails = {
    hash: '0x0908f7a70a9f8acd9ced904f4e288bc46ae42923ce82bde706b26fdb8452abec' as Hex,
    type: 'legacy' as const,
    from: zeroAddress,
    gas: 0n,
    input: '0x' as Hex,
    nonce: 0,
    r: zeroHash,
    s: zeroHash,
    to: null,
    typeHex: null,
    v: 0n,
    value: 0n,
    blockHash: null,
    blockNumber: null,
    transactionIndex: null,
    gasPrice: 0n,
  };

  beforeEach(() => {
    evmTrackerParams = {
      onTxDetailsGot: vi.fn(),
      onInitialize: vi.fn(),
      onFinished: vi.fn(),
      onFailed: vi.fn(),
      onReplaced: vi.fn(),
      tx: {
        txKey: '0x0908f7a70a9f8acd9ced904f4e288bc46ae42923ce82bde706b26fdb8452abec',
        chainId: sepolia.id,
      },
      chains: [sepolia],
    };
    viemActions.getTransaction.mockResolvedValue(mockTxDetails);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  test('should call onInitialize when the tracker starts', async () => {
    await evmTracker(evmTrackerParams);
    expect(evmTrackerParams.onInitialize).toHaveBeenCalled();
  });

  test('should call onTxDetailsGot with transaction details', async () => {
    await evmTracker(evmTrackerParams);
    expect(evmTrackerParams.onTxDetailsGot).toHaveBeenCalledWith(mockTxDetails);
  });

  test('should call onFinished for a successfully mined transaction', async () => {
    const mockReceipt = { status: 'success', transactionHash: evmTrackerParams.tx.txKey };
    viemActions.waitForTransactionReceipt.mockResolvedValue(mockReceipt as any);
    await evmTracker(evmTrackerParams);
    expect(evmTrackerParams.onFinished).toHaveBeenCalledWith(mockTxDetails, mockReceipt, expect.anything());
  });

  test('should call onFinished for a reverted transaction', async () => {
    const mockReceipt = { status: 'reverted', transactionHash: evmTrackerParams.tx.txKey };
    viemActions.waitForTransactionReceipt.mockResolvedValue(mockReceipt as any);
    await evmTracker(evmTrackerParams);
    expect(evmTrackerParams.onFinished).toHaveBeenCalledWith(mockTxDetails, mockReceipt, expect.anything());
  });

  test('should call onFailed if getTransaction throws an error', async () => {
    const mockError = new Error('Transaction not found');
    viemActions.getTransaction.mockRejectedValue(mockError);
    await evmTracker({ ...evmTrackerParams, retryCount: 1, retryTimeout: 1 });
    expect(evmTrackerParams.onFailed).toHaveBeenCalledWith(mockError);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test('should throw an error if the transaction hash is zeroHash', async () => {
    const paramsForZeroHash = {
      ...evmTrackerParams,
      tx: { ...evmTrackerParams.tx, txKey: zeroHash },
    };
    await expect(evmTracker(paramsForZeroHash)).rejects.toThrow('Transaction hash is zeroHash');
    expect(viemActions.getTransaction).not.toHaveBeenCalled();
    expect(paramsForZeroHash.onFailed).not.toHaveBeenCalled();
  });

  test('should call onReplaced and not onFinished when a transaction is replaced', async () => {
    const replacementData = {
      reason: 'repriced' as const,
      transaction: { hash: '0xnewHash' as Hex },
    };

    // Simulate viem's behavior: onReplaced is called, and then the promise resolves.
    viemActions.waitForTransactionReceipt.mockImplementation(async (_client, { onReplaced }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      onReplaced?.(replacementData);
      return { status: 'success' } as any; // The tracker will resolve with a dummy receipt.
    });

    await evmTracker(evmTrackerParams);

    // Assert that onReplaced was called correctly.
    expect(evmTrackerParams.onReplaced).toHaveBeenCalledTimes(1);
    expect(evmTrackerParams.onReplaced).toHaveBeenCalledWith(replacementData);

    // Assert that onFinished was NOT called, because the internal `txWasReplaced` flag prevents it.
    expect(evmTrackerParams.onFinished).not.toHaveBeenCalled();
  });
});
