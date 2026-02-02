/**
 * @file Unit tests for the Solana transaction tracker.
 * This suite tests the store-connected `solanaTrackerForStore` function.
 * It mocks the internal `initializePollingTracker` to verify that callbacks
 * correctly update the transaction state in the store.
 * @vitest-environment jsdom
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import {
  initializePollingTracker,
  ITxTrackingStore,
  SolanaTransaction,
  TrackerCallbacks,
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

// Mock normalizeError to return a predictable structure.
vi.mock('@tuwaio/orbit-core', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/orbit-core')>();
  return {
    ...original,
    normalizeError: (err: unknown) => ({
      message: err instanceof Error ? err.message : 'Unknown error',
      raw: { originalError: err },
    }),
  };
});

// --- Test Suite ---

type MockParams = Pick<
  ITxTrackingStore<SolanaTransaction>,
  'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'
> &
  TrackerCallbacks<SolanaTransaction> & { tx: SolanaTransaction };

describe('solanaTrackerForStore', () => {
  let mockTx: SolanaTransaction;
  let mockParams: MockParams;

  beforeEach(() => {
    // Define a mock Solana transaction with proper fields.
    mockTx = {
      adapter: OrbitAdapter.SOLANA,
      txKey: 'mockedTxKey',
      rpcUrl: 'https://api.mainnet-beta.solana.com',
      localTimestamp: dayjs().unix(),
      pending: true,
      from: 'mockAddress',
      chainId: 'mainnet',
      tracker: TransactionTracker.Solana,
      type: 'mockType',
      connectorType: 'mockConnectorType',
    };

    // Define mock store methods for testing.
    mockParams = {
      tx: mockTx,
      transactionsPool: { [mockTx.txKey]: mockTx },
      updateTxParams: vi.fn() as unknown as ITxTrackingStore<SolanaTransaction>['updateTxParams'],
      onSuccess: vi.fn() as unknown as TrackerCallbacks<SolanaTransaction>['onSuccess'],
      onError: vi.fn() as unknown as TrackerCallbacks<SolanaTransaction>['onError'],
      removeTxFromPool: vi.fn() as unknown as ITxTrackingStore<SolanaTransaction>['removeTxFromPool'],
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call initializePollingTracker with the correct parameters', async () => {
    await solanaTrackerForStore(mockParams);

    // Validate that the polling tracker is initialized with the correct configuration.
    expect(initializePollingTracker).toHaveBeenCalled();
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];
    expect(config.tx).toBe(mockTx);
    expect(config.pollingInterval).toBe(2500);
    expect(config.maxRetries).toBe(10);
  });

  test('should call updateTxParams with SUCCESS on onSuccess callback', () => {
    solanaTrackerForStore(mockParams);
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
    expect(mockParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      status: TransactionStatus.Success,
      pending: false,
      isError: false,
      finishedTimestamp: expect.any(Number),
      confirmations: 'MAX',
      slot: 12345,
    });
  });

  test('should call user onSuccess callback when transaction succeeds', () => {
    solanaTrackerForStore(mockParams);
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    const mockSuccessResponse = {
      slot: 12345,
      confirmations: 10,
      err: null,
      confirmationStatus: 'finalized' as const,
    };
    config.onSuccess(mockSuccessResponse);

    expect(mockParams.onSuccess).toHaveBeenCalledWith(expect.objectContaining({ txKey: mockTx.txKey }));
  });

  test('should call updateTxParams with FAILED on onFailure callback (on-chain error)', () => {
    solanaTrackerForStore(mockParams);
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
    expect(mockParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      status: TransactionStatus.Failed,
      pending: false,
      isError: true,
      error: expect.objectContaining({
        message: 'Unknown error', // TransactionError is not an Error instance
        raw: expect.objectContaining({ originalError: txError }),
      }),
      finishedTimestamp: expect.any(Number),
    });
  });

  test('should call user onError callback when transaction fails', () => {
    solanaTrackerForStore(mockParams);
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    const txError: TransactionError = { InstructionError: [0, { Custom: 123 }] };
    const mockFailureResponse = {
      slot: 12345,
      confirmations: 0,
      err: txError,
      confirmationStatus: 'finalized' as const,
    };
    config.onFailure(mockFailureResponse);

    // The error passed to onError should be the raw TransactionError
    expect(mockParams.onError).toHaveBeenCalledWith(
      txError,
      expect.objectContaining({ txKey: mockTx.txKey }),
    );
  });

  test('should call updateTxParams with FAILED on onFailure callback (timeout)', () => {
    solanaTrackerForStore(mockParams);
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    // Simulate a timeout by invoking `onFailure` with `undefined`.
    config.onFailure(undefined);

    // Confirm the store's state is updated to reflect a timeout failure.
    expect(mockParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      status: TransactionStatus.Failed,
      pending: false,
      isError: true,
      error: expect.objectContaining({
        message: 'Transaction tracking timed out or the transaction was not found.',
        raw: expect.anything(),
      }),
      finishedTimestamp: expect.any(Number),
    });
  });

  test('should call user onError callback on timeout', () => {
    solanaTrackerForStore(mockParams);
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    config.onFailure(undefined);

    expect(mockParams.onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ txKey: mockTx.txKey }),
    );
  });

  test('should call updateTxParams with confirmations on onIntervalTick callback', () => {
    solanaTrackerForStore(mockParams);
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

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
    expect(mockParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      confirmations: 5,
      slot: 12344,
    });
  });

  test('should remove transaction from pool on stopPolling when configured to do so', () => {
    solanaTrackerForStore(mockParams);
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    // Simulate calling `stopPolling`.
    config.removeTxFromPool?.(mockTx.txKey);

    // Verify that the transaction is removed from the pool.
    expect(mockParams.removeTxFromPool).toHaveBeenCalledWith(mockTx.txKey);
  });

  test('should handle non-finalized transaction states (e.g., pending)', () => {
    solanaTrackerForStore(mockParams);
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
    expect(mockParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      confirmations: 3,
      slot: 12344,
    });
  });
});
