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
    getBlock: vi.fn(),
  };
});

// We need to await the mocked module to get the mocked functions.
const { waitForTransactionReceipt, getTransaction, getBlock } = await import('viem/actions');
const viemActions = {
  waitForTransactionReceipt: vi.mocked(waitForTransactionReceipt),
  getTransaction: vi.mocked(getTransaction),
  getBlock: vi.mocked(getBlock),
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// =================================================================================================
// evmTrackerForStore Tests - Testing TrackerCallbacks Integration
// =================================================================================================

import { ITxTrackingStore, Transaction, TransactionStatus } from '@tuwaio/pulsar-core';

import { evmTrackerForStore } from './evmTracker';

describe('evmTrackerForStore Unit Tests - TrackerCallbacks', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  let consoleErrorSpy: vi.SpyInstance;

  const mockTxKey = '0x0908f7a70a9f8acd9ced904f4e288bc46ae42923ce82bde706b26fdb8452abec' as Hex;

  const mockTxDetails = {
    hash: mockTxKey,
    nonce: 1,
    from: zeroAddress,
    to: zeroAddress,
    value: 0n,
    input: '0x' as Hex,
  } as const;

  const mockBlock = {
    timestamp: BigInt(1700000000),
  };

  // Mock transaction for the pool
  const createMockTx = (): Transaction =>
    ({
      txKey: mockTxKey,
      chainId: sepolia.id,
      adapter: 'evm' as const,
      tracker: 'ethereum' as const,
      pending: true,
      localTimestamp: Date.now(),
      from: zeroAddress,
      type: 'test',
      connectorType: 'injected',
    }) as unknown as Transaction;

  let config: ReturnType<typeof createConfig>;
  let transactionsPool: Record<string, Transaction>;

  beforeEach(() => {
    config = createConfig({
      chains: [sepolia, mainnet],
      client({ chain }) {
        return createClient({ chain, transport: http() });
      },
    });

    transactionsPool = {
      [mockTxKey]: createMockTx(),
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    viemActions.getTransaction.mockResolvedValue(mockTxDetails);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    viemActions.getBlock.mockResolvedValue(mockBlock);

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  test('should call onSuccess callback when transaction succeeds', async () => {
    const mockReceipt = { status: 'success', blockNumber: 1n } as TransactionReceipt;
    viemActions.waitForTransactionReceipt.mockResolvedValue(mockReceipt);

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const updateTxParams = vi.fn() as unknown as ITxTrackingStore<Transaction>['updateTxParams'];

    await evmTrackerForStore({
      tx: createMockTx(),
      config,
      updateTxParams,
      transactionsPool,
      onSuccess,
      onError,
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({ txKey: mockTxKey }));
    expect(onError).not.toHaveBeenCalled();
  });

  test('should call onError callback when transaction reverts', async () => {
    const mockReceipt = { status: 'reverted', blockNumber: 1n } as TransactionReceipt;
    viemActions.waitForTransactionReceipt.mockResolvedValue(mockReceipt);

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const updateTxParams = vi.fn() as unknown as ITxTrackingStore<Transaction>['updateTxParams'];

    await evmTrackerForStore({
      tx: createMockTx(),
      config,
      updateTxParams,
      transactionsPool,
      onSuccess,
      onError,
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.objectContaining({ txKey: mockTxKey }));
    expect(onSuccess).not.toHaveBeenCalled();
  });

  test('should call onReplaced callback when transaction is replaced', async () => {
    const replacementData = {
      reason: 'repriced' as const,
      transaction: { hash: '0xnewHash' as Hex },
    };

    viemActions.waitForTransactionReceipt.mockImplementation(async (_client, { onReplaced }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onReplaced?.(replacementData as any);
      return { status: 'success' } as TransactionReceipt;
    });

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onReplaced = vi.fn();
    const updateTxParams = vi.fn() as unknown as ITxTrackingStore<Transaction>['updateTxParams'];

    await evmTrackerForStore({
      tx: createMockTx(),
      config,
      updateTxParams,
      transactionsPool,
      onSuccess,
      onError,
      onReplaced,
    });

    expect(onReplaced).toHaveBeenCalledTimes(1);
    expect(onReplaced).toHaveBeenCalledWith(
      expect.objectContaining({ txKey: mockTxKey }),
      expect.objectContaining({ txKey: mockTxKey }),
    );
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test('should update transaction status to Success via updateTxParams', async () => {
    const mockReceipt = { status: 'success', blockNumber: 1n } as TransactionReceipt;
    viemActions.waitForTransactionReceipt.mockResolvedValue(mockReceipt);

    const updateTxParams = vi.fn() as unknown as ITxTrackingStore<Transaction>['updateTxParams'];

    await evmTrackerForStore({
      tx: createMockTx(),
      config,
      updateTxParams,
      transactionsPool,
      onSuccess: vi.fn(),
    });

    expect(updateTxParams).toHaveBeenCalledWith(
      mockTxKey,
      expect.objectContaining({
        status: TransactionStatus.Success,
        isError: false,
        pending: false,
      }),
    );
  });

  test('should update transaction status to Failed via updateTxParams on revert', async () => {
    const mockReceipt = { status: 'reverted', blockNumber: 1n } as TransactionReceipt;
    viemActions.waitForTransactionReceipt.mockResolvedValue(mockReceipt);

    const updateTxParams = vi.fn() as unknown as ITxTrackingStore<Transaction>['updateTxParams'];

    await evmTrackerForStore({
      tx: createMockTx(),
      config,
      updateTxParams,
      transactionsPool,
      onError: vi.fn(),
    });

    expect(updateTxParams).toHaveBeenCalledWith(
      mockTxKey,
      expect.objectContaining({
        status: TransactionStatus.Failed,
        isError: true,
        pending: false,
      }),
    );
  });

  test('should update transaction status to Replaced via updateTxParams', async () => {
    const replacementData = {
      reason: 'repriced' as const,
      transaction: { hash: '0xnewHash' as Hex },
    };

    viemActions.waitForTransactionReceipt.mockImplementation(async (_client, { onReplaced }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onReplaced?.(replacementData as any);
      return { status: 'success' } as TransactionReceipt;
    });

    const updateTxParams = vi.fn() as unknown as ITxTrackingStore<Transaction>['updateTxParams'];

    await evmTrackerForStore({
      tx: createMockTx(),
      config,
      updateTxParams,
      transactionsPool,
      onReplaced: vi.fn(),
    });

    expect(updateTxParams).toHaveBeenCalledWith(
      mockTxKey,
      expect.objectContaining({
        status: TransactionStatus.Replaced,
        replacedTxHash: '0xnewHash',
        pending: false,
      }),
    );
  });
});
