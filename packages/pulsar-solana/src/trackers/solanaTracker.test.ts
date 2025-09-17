/**
 * @file Unit tests for the Solana transaction tracker.
 * This suite tests the store-connected `solanaTrackerForStore` function.
 * It mocks the internal `initializePollingTracker` to verify that callbacks
 * correctly update the transaction state in the store.
 * @vitest-environment jsdom
 */

import {
  initializePollingTracker,
  PollingTrackerConfig,
  SolanaTransaction,
  TransactionAdapter,
  TransactionStatus,
  TransactionTracker,
} from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { TransactionError } from 'gill';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { solanaTrackerForStore } from './solanaTracker';

// --- Mocks ---

// Mock the core polling utility.
vi.mock('@tuwaio/pulsar-core', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/pulsar-core')>();
  return {
    ...original,
    initializePollingTracker: vi.fn(),
  };
});

// --- Test Suite ---

describe('solanaTrackerForStore', () => {
  let mockTx: SolanaTransaction;
  let mockStoreParams: any;

  beforeEach(() => {
    // Define a mock Solana transaction with proper fields.
    mockTx = {
      adapter: TransactionAdapter.SOLANA,
      txKey: 'mockedTxKey',
      rpcUrl: 'https://api.mainnet-beta.solana.com',
      localTimestamp: dayjs().unix(),
      pending: true,
      from: 'mockAddress',
      chainId: 'mainnet',
      tracker: TransactionTracker.Solana,
      type: 'mockType',
      walletType: 'mockWalletType',
    };

    // Define mock store methods for testing.
    mockStoreParams = {
      transactionsPool: { [mockTx.txKey]: mockTx },
      updateTxParams: vi.fn(),
      onSucceedCallbacks: vi.fn(),
      removeTxFromPool: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call initializePollingTracker with the correct parameters', async () => {
    await solanaTrackerForStore({ tx: mockTx, ...mockStoreParams });

    // Validate that the polling tracker is initialized with the correct configuration.
    expect(initializePollingTracker).toHaveBeenCalled();
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];
    expect(config.tx).toBe(mockTx);
    expect(config.pollingInterval).toBe(2500);
    expect(config.maxRetries).toBe(10);
  });

  test('should call updateTxParams with SUCCESS on onSuccess callback', () => {
    solanaTrackerForStore({ tx: mockTx, ...mockStoreParams });
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    // Simulate a successful transaction update via the `onSuccess` callback.
    const mockSuccessResponse = {
      slot: 12345,
      confirmations: 10,
      err: null,
      confirmationStatus: 'finalized' as const,
    };
    config.onSuccess(mockSuccessResponse);

    // Ensure the store's `updateTxParams` function is called with the correct parameters.
    expect(mockStoreParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      status: TransactionStatus.Success,
      pending: false,
      isError: false,
      finishedTimestamp: expect.any(Number),
      confirmations: 10,
      slot: 12345,
    });
  });

  test('should call updateTxParams with FAILED on onFailure callback (on-chain error)', () => {
    solanaTrackerForStore({ tx: mockTx, ...mockStoreParams });
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    // Define a simulated on-chain error response.
    const txError: TransactionError = { InstructionError: [0, { Custom: 123 }] };
    const mockFailureResponse = {
      slot: 12345,
      confirmations: 0,
      err: txError,
      confirmationStatus: 'finalized' as const,
    };
    config.onFailure(mockFailureResponse);

    // Ensure the store's state is updated to reflect the failure.
    expect(mockStoreParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      status: TransactionStatus.Failed,
      pending: false,
      isError: true,
      errorMessage: `Transaction failed: ${JSON.stringify(txError)}`,
      finishedTimestamp: expect.any(Number),
    });
  });

  test('should call updateTxParams with FAILED on onFailure callback (timeout)', () => {
    solanaTrackerForStore({ tx: mockTx, ...mockStoreParams });
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    // Simulate a timeout by invoking `onFailure` with `undefined`.
    config.onFailure(undefined);

    // Confirm the store's state is updated to reflect a timeout failure.
    expect(mockStoreParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      status: TransactionStatus.Failed,
      pending: false,
      isError: true,
      errorMessage: 'Transaction tracking timed out or the transaction was not found.',
      finishedTimestamp: expect.any(Number),
    });
  });

  test('should call updateTxParams with confirmations on onIntervalTick callback', () => {
    solanaTrackerForStore({ tx: mockTx, ...mockStoreParams });
    const config: PollingTrackerConfig<any, any> = vi.mocked(initializePollingTracker).mock.calls[0][0];

    // Mock the intermediate response.
    const mockIntervalResponse = {
      slot: 12344,
      confirmations: 5,
      err: null,
      confirmationStatus: 'confirmed' as const,
    };

    // Simulate calling `onIntervalTick`.
    config.onIntervalTick?.(mockIntervalResponse);

    // Check that only `confirmations` and `slot` are updated for ongoing tracking, without terminal updates.
    expect(mockStoreParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      confirmations: 5,
      slot: 12344,
    });
  });

  test('should remove transaction from pool on stopPolling when configured to do so', () => {
    solanaTrackerForStore({ tx: mockTx, ...mockStoreParams });
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    // Simulate calling `stopPolling`.
    config.removeTxFromPool?.(mockTx.txKey);

    // Verify that the transaction is removed from the pool.
    expect(mockStoreParams.removeTxFromPool).toHaveBeenCalledWith(mockTx.txKey);
  });

  test('should handle non-finalized transaction states (e.g., pending)', () => {
    solanaTrackerForStore({ tx: mockTx, ...mockStoreParams });
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    // Define a pending mock response.
    const mockPendingResponse = {
      slot: 12344,
      confirmations: 3,
      err: null,
      confirmationStatus: 'processed' as const,
    };

    // Call `onIntervalTick` to simulate periodic updates for a pending transaction.
    config.onIntervalTick?.(mockPendingResponse);

    // Validate that the store is updated correctly for non-finalized states.
    expect(mockStoreParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      confirmations: 3,
      slot: 12344,
    });
  });
});
