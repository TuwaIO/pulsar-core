/**
 * @file Unit tests for the Solana transaction tracker.
 * This file uses a high-level mocking strategy to test the store-connected `solanaTrackerForStore` function.
 * It mocks the internal `solanaFetcher` and the core `initializePollingTracker` to verify that callbacks
 * correctly update the transaction state.
 * @vitest-environment jsdom
 */

import {
  initializePollingTracker,
  PollingTrackerConfig,
  SolanaTransaction,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import { TransactionAdapter } from '@tuwaio/pulsar-core/src';
import dayjs from 'dayjs';
import { TransactionError } from 'gill';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { SolanaTransactionTracker } from '../types';
import { solanaTrackerForStore } from './solanaTracker';

// --- Mocks ---

// 1. Mock the core polling utility.
vi.mock('@tuwaio/pulsar-core', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/pulsar-core')>();
  return {
    ...original,
    initializePollingTracker: vi.fn(),
  };
});

// --- Test Suite ---

describe('solanaTrackerForStore', () => {
  let mockTx: SolanaTransaction<SolanaTransactionTracker>;
  let mockStoreParams: any;

  beforeEach(() => {
    // A complete and correctly typed mock transaction object.
    mockTx = {
      adapter: TransactionAdapter.SOLANA,
      txKey: '5wN2N5J9iW2i2aB9W2i2aB9W2i2aB9W2i2aB9W2i2aB9W2i2aB9W2i2aB9W2i2aB9W2i',
      rpcUrl: 'https://api.mainnet-beta.solana.com',
      localTimestamp: dayjs().unix(),
      pending: true,
      from: 'So11111111111111111111111111111111111111112',
      chainId: 'solana:mainnet', // Updated to Wallet Standard chain format
      tracker: SolanaTransactionTracker.Solana,
      type: 'test',
      walletType: 'test',
    };

    // Mock store methods that the tracker will call.
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

    // Check that our main tracker function correctly configures the generic poller.
    expect(initializePollingTracker).toHaveBeenCalled();
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];
    expect(config.tx).toBe(mockTx);
    expect(config.pollingInterval).toBe(2500);
    expect(config.maxRetries).toBe(720);
  });

  test('should call updateTxParams with SUCCESS on the onSuccess callback', () => {
    // 1. Call the main function to get the config passed to the poller.
    solanaTrackerForStore({ tx: mockTx, ...mockStoreParams });
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    // 2. Simulate the fetcher succeeding by manually calling the `onSuccess` callback.
    const mockSuccessResponse = {
      slot: 12345n,
      confirmations: 10,
      err: null,
      confirmationStatus: 'finalized' as const,
    };
    config.onSuccess(mockSuccessResponse);

    // 3. Assert that the store was updated correctly.
    expect(mockStoreParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      status: TransactionStatus.Success,
      pending: false,
      isError: false,
      finishedTimestamp: expect.any(Number),
      confirmations: 10,
      slot: 12345,
    });

    // 4. Assert that the global success callback was triggered.
    expect(mockStoreParams.onSucceedCallbacks).toHaveBeenCalled();
  });

  test('should call updateTxParams with FAILED on the onFailure callback (on-chain error)', () => {
    solanaTrackerForStore({ tx: mockTx, ...mockStoreParams });
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    const txError: TransactionError = { InstructionError: [0, { Custom: 123 }] };
    const mockFailureResponse = {
      slot: 12345n,
      confirmations: 0,
      err: txError,
      confirmationStatus: 'finalized' as const,
    };
    config.onFailure(mockFailureResponse);

    expect(mockStoreParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      status: TransactionStatus.Failed,
      pending: false,
      isError: true,
      errorMessage: `Transaction failed: ${JSON.stringify(txError)}`,
      finishedTimestamp: expect.any(Number),
    });
  });

  test('should call updateTxParams with FAILED on the onFailure callback (timeout)', () => {
    solanaTrackerForStore({ tx: mockTx, ...mockStoreParams });
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    // Simulate a timeout by calling onFailure with `undefined`, as the generic poller does.
    config.onFailure(undefined);

    expect(mockStoreParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      status: TransactionStatus.Failed,
      pending: false,
      isError: true,
      errorMessage: 'Transaction tracking timed out or the transaction was not found.',
      finishedTimestamp: expect.any(Number),
    });
  });

  test('should call updateTxParams with confirmations on the onIntervalTick callback', () => {
    solanaTrackerForStore({ tx: mockTx, ...mockStoreParams });
    const config: PollingTrackerConfig<any, any, any> = vi.mocked(initializePollingTracker).mock.calls[0][0];

    const mockIntervalResponse = {
      slot: 12344n,
      confirmations: 5,
      err: null,
      confirmationStatus: 'confirmed' as const,
    };

    config.onIntervalTick?.(mockIntervalResponse);

    // Assert that only confirmations and slot are updated, not the terminal status.
    expect(mockStoreParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
      confirmations: 5,
      slot: 12344,
    });
  });
});
