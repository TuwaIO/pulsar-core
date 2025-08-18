/**
 * @file Unit tests for the Gelato transaction tracker.
 * This file tests both the low-level fetcher (`fetchTxFromGelatoAPI`) and the high-level tracker functions.
 * It ensures that the tracker correctly handles various states from the Gelato API.
 * @vitest-environment jsdom
 */

import { initializePollingTracker } from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { zeroHash } from 'viem';
import { sepolia } from 'viem/chains';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  fetchTxFromGelatoAPI,
  GelatoTaskState,
  GelatoTaskStatusResponse,
  gelatoTracker,
  GelatoTrackerParams,
} from './gelatoTracker';

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
    chainId: sepolia.id,
    taskId: '0x123abc-test-task',
    taskState,
    creationDate: creationDate ?? dayjs().toISOString(),
    executionDate: dayjs().add(5, 'minutes').toISOString(),
    transactionHash: zeroHash,
    lastCheckMessage: `Task is ${taskState}`,
  },
});

describe('gelatoTracker', () => {
  test('should call initializePollingTracker with the correct fetcher and parameters', async () => {
    // V-- Correction: txKey is a string, as per checkTransactionsTracker --V
    const mockParams: GelatoTrackerParams = {
      tx: { txKey: '0x123abc-test-task', pending: true },
      onSucceed: vi.fn(),
      onFailed: vi.fn(),
    };

    await gelatoTracker(mockParams);

    expect(initializePollingTracker).toHaveBeenCalledTimes(1);
    // Verify it's configured with our Gelato-specific fetcher and passes other params through.
    expect(vi.mocked(initializePollingTracker).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        ...mockParams,
        fetcher: fetchTxFromGelatoAPI,
      }),
    );
  });
});

describe('fetchTxFromGelatoAPI', () => {
  const mockFetcherParams = {
    // V-- Correction: txKey is a string, as per checkTransactionsTracker --V
    tx: { txKey: '0x123abc-test-task' },
    onSucceed: vi.fn(),
    onFailed: vi.fn(),
    onIntervalTick: vi.fn(),
    clearWatch: vi.fn(),
  };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call onSucceed and clearWatch when task state is ExecSuccess', async () => {
    const mockResponse = createMockResponse(GelatoTaskState.ExecSuccess);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    await fetchTxFromGelatoAPI(mockFetcherParams as any);

    expect(mockFetcherParams.onSucceed).toHaveBeenCalledWith(mockResponse);
    expect(mockFetcherParams.clearWatch).toHaveBeenCalledWith(true);
    expect(mockFetcherParams.onFailed).not.toHaveBeenCalled();
  });

  test.each([GelatoTaskState.ExecReverted, GelatoTaskState.Cancelled])(
    'should call onFailed and clearWatch for terminal failure state: %s',
    async (failureState) => {
      const mockResponse = createMockResponse(failureState);
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await fetchTxFromGelatoAPI(mockFetcherParams as any);

      expect(mockFetcherParams.onFailed).toHaveBeenCalledWith(mockResponse);
      expect(mockFetcherParams.clearWatch).toHaveBeenCalledWith(true);
      expect(mockFetcherParams.onSucceed).not.toHaveBeenCalled();
    },
  );

  test.each([GelatoTaskState.CheckPending, GelatoTaskState.ExecPending, GelatoTaskState.WaitingForConfirmation])(
    'should only call onIntervalTick for pending state: %s',
    async (pendingState) => {
      const mockResponse = createMockResponse(pendingState);
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await fetchTxFromGelatoAPI(mockFetcherParams as any);

      expect(mockFetcherParams.onIntervalTick).toHaveBeenCalledWith(mockResponse);
      expect(mockFetcherParams.clearWatch).not.toHaveBeenCalled();
      expect(mockFetcherParams.onSucceed).not.toHaveBeenCalled();
      expect(mockFetcherParams.onFailed).not.toHaveBeenCalled();
    },
  );

  test('should call clearWatch without removing from pool if a task is stale', async () => {
    const oldCreationDate = dayjs().subtract(2, 'days').toISOString();
    const mockResponse = createMockResponse(GelatoTaskState.ExecPending, oldCreationDate);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    await fetchTxFromGelatoAPI(mockFetcherParams as any);

    // Called without `true`, which means stop polling but keep in the pool.
    expect(mockFetcherParams.clearWatch).toHaveBeenCalledWith();
    expect(mockFetcherParams.clearWatch).toHaveBeenCalledTimes(1);
  });

  test('should not call any callbacks if the fetch response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    await fetchTxFromGelatoAPI(mockFetcherParams as any);

    expect(mockFetcherParams.onIntervalTick).not.toHaveBeenCalled();
    expect(mockFetcherParams.onSucceed).not.toHaveBeenCalled();
    expect(mockFetcherParams.onFailed).not.toHaveBeenCalled();
    expect(mockFetcherParams.clearWatch).not.toHaveBeenCalled();
  });
});
