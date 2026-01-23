/**
 * @file Unit tests for the Gelato transaction tracker.
 * This file tests the high-level `gelatoTrackerForStore` function.
 * It mocks the core `initializePollingTracker` utility to inspect the fetcher's behavior
 * in response to various simulated Gelato API states.
 * @vitest-environment jsdom
 */

import {
  initializePollingTracker,
  ITxTrackingStore,
  PollingTrackerConfig,
  TrackerCallbacks,
  Transaction,
  TransactionStatus,
} from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { zeroHash } from 'viem';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { GelatoTaskState, GelatoTaskStatusResponse, gelatoTrackerForStore } from './gelatoTracker';

// Mock the core polling utility to isolate the gelatoTracker logic.
vi.mock('@tuwaio/pulsar-core', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/pulsar-core')>();
  return {
    ...original,
    initializePollingTracker: vi.fn(),
  };
});

// Helper to create a mock API response from Gelato.
const createMockResponse = (taskState: GelatoTaskState, creationDate?: string): GelatoTaskStatusResponse => ({
  task: {
    chainId: 1,
    taskId: '0x123abc-test-task',
    taskState,
    creationDate: creationDate ?? dayjs().toISOString(),
    executionDate: dayjs().add(5, 'minutes').toISOString(),
    transactionHash: zeroHash,
    lastCheckMessage: `Task is ${taskState}`,
  },
});

type MockParams = Pick<ITxTrackingStore<Transaction>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'> &
  TrackerCallbacks<Transaction> & { tx: Transaction };

describe('gelatoTrackerForStore', () => {
  let mockTx: Transaction;
  let mockParams: MockParams;

  let fetcher: PollingTrackerConfig<GelatoTaskStatusResponse, Transaction>['fetcher'];

  beforeEach(() => {
    mockTx = { txKey: '0x123abc-test-task', pending: true } as Transaction;

    mockParams = {
      tx: mockTx,
      transactionsPool: { [mockTx.txKey]: mockTx },
      updateTxParams: vi.fn() as unknown as ITxTrackingStore<Transaction>['updateTxParams'],
      onSuccess: vi.fn() as unknown as TrackerCallbacks<Transaction>['onSuccess'],
      onError: vi.fn() as unknown as TrackerCallbacks<Transaction>['onError'],
      removeTxFromPool: vi.fn() as unknown as ITxTrackingStore<Transaction>['removeTxFromPool'],
    };

    // Mock the global fetch API.
    global.fetch = vi.fn();

    // Call the tracker to set up the mock for initializePollingTracker.
    gelatoTrackerForStore(mockParams);

    // Extract the generated fetcher function from the mock call.
    fetcher = vi.mocked(initializePollingTracker).mock.calls[0][0].fetcher as PollingTrackerConfig<
      GelatoTaskStatusResponse,
      Transaction
    >['fetcher'];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call onSuccess when task state is ExecSuccess', async () => {
    const mockResponse = createMockResponse(GelatoTaskState.ExecSuccess);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const pollingCallbacks = {
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      stopPolling: vi.fn(),
    };

    await fetcher({ tx: mockTx, ...pollingCallbacks });

    expect(pollingCallbacks.onSuccess).toHaveBeenCalledWith(mockResponse);
    expect(pollingCallbacks.onFailure).not.toHaveBeenCalled();
  });

  test('should call user onSuccess callback when transaction succeeds', () => {
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    const mockResponse = createMockResponse(GelatoTaskState.ExecSuccess);
    config.onSuccess(mockResponse);

    expect(mockParams.updateTxParams).toHaveBeenCalledWith(
      mockTx.txKey,
      expect.objectContaining({
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
      }),
    );
    expect(mockParams.onSuccess).toHaveBeenCalledWith(expect.objectContaining({ txKey: mockTx.txKey }));
  });

  test('should call user onError callback when transaction fails', () => {
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    const mockResponse = createMockResponse(GelatoTaskState.ExecReverted);
    config.onFailure(mockResponse);

    expect(mockParams.updateTxParams).toHaveBeenCalledWith(
      mockTx.txKey,
      expect.objectContaining({
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
      }),
    );
    expect(mockParams.onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ txKey: mockTx.txKey }),
    );
  });

  test.each([
    [GelatoTaskState.ExecReverted],
    [GelatoTaskState.Cancelled],
    [GelatoTaskState.NotFound], // Testing the 404 case
  ])('should call onFailure for terminal failure state: %s', async (failureState) => {
    const mockResponse = createMockResponse(failureState);

    if (failureState === GelatoTaskState.NotFound) {
      vi.mocked(fetch).mockResolvedValue({ ok: false, status: 404 } as Response);
    } else {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);
    }

    const pollingCallbacks = {
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      stopPolling: vi.fn(),
    };

    await fetcher({ tx: mockTx, ...pollingCallbacks });

    expect(pollingCallbacks.onFailure).toHaveBeenCalled();
    expect(pollingCallbacks.onSuccess).not.toHaveBeenCalled();
  });

  test.each([[GelatoTaskState.CheckPending], [GelatoTaskState.ExecPending], [GelatoTaskState.WaitingForConfirmation]])(
    'should only call onIntervalTick for pending state: %s',
    async (pendingState) => {
      const mockResponse = createMockResponse(pendingState);
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const pollingCallbacks = {
        onSuccess: vi.fn(),
        onFailure: vi.fn(),
        onIntervalTick: vi.fn(),
        stopPolling: vi.fn(),
      };

      await fetcher({ tx: mockTx, ...pollingCallbacks });

      expect(pollingCallbacks.onIntervalTick).toHaveBeenCalledWith(mockResponse);
      expect(pollingCallbacks.onSuccess).not.toHaveBeenCalled();
      expect(pollingCallbacks.onFailure).not.toHaveBeenCalled();
      expect(pollingCallbacks.stopPolling).not.toHaveBeenCalled();
    },
  );

  test('should call stopPolling if a task is stale (older than 1 day)', async () => {
    const oldCreationDate = dayjs().subtract(2, 'days').toISOString();
    const mockResponse = createMockResponse(GelatoTaskState.ExecPending, oldCreationDate);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const pollingCallbacks = {
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      stopPolling: vi.fn(),
    };

    await fetcher({ tx: mockTx, ...pollingCallbacks });

    expect(pollingCallbacks.stopPolling).toHaveBeenCalledWith();
  });

  test('should throw an error if the fetch response is not ok (and not 404)', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response);

    const pollingCallbacks = {
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      stopPolling: vi.fn(),
    };

    // We expect the fetcher to throw so that the polling tracker can handle the retry.
    await expect(fetcher({ tx: mockTx, ...pollingCallbacks })).rejects.toThrow();
  });
});
