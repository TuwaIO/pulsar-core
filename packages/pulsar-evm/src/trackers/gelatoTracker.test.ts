/**
 * @file Unit tests for the Gelato transaction tracker.
 * This file tests the high-level `gelatoTrackerForStore` function.
 * It mocks the core `initializePollingTracker` utility to inspect the fetcher's behavior
 * in response to various simulated Gelato API states.
 * @vitest-environment jsdom
 */

import { initializePollingTracker, PollingTrackerConfig } from '@tuwaio/pulsar-core';
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

describe('gelatoTrackerForStore', () => {
  let mockStoreParams: any;
  let fetcher: PollingTrackerConfig<any, any, any>['fetcher'];

  beforeEach(() => {
    // Basic store parameters that will be passed to the tracker.
    mockStoreParams = {
      tx: { txKey: '0x123abc-test-task', pending: true },
      transactionsPool: {},
      updateTxParams: vi.fn(),
      onSucceedCallbacks: vi.fn(),
      removeTxFromPool: vi.fn(),
    };

    // Mock the global fetch API.
    global.fetch = vi.fn();

    // Call the tracker to set up the mock for initializePollingTracker.
    gelatoTrackerForStore(mockStoreParams);

    // Extract the generated fetcher function from the mock call.
    // This allows us to test the fetcher's logic in isolation.
    fetcher = vi.mocked(initializePollingTracker).mock.calls[0][0].fetcher;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call onSucceed when task state is ExecSuccess', async () => {
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

    await fetcher({ tx: mockStoreParams.tx, ...pollingCallbacks });

    expect(pollingCallbacks.onSuccess).toHaveBeenCalledWith(mockResponse);
    expect(pollingCallbacks.onFailure).not.toHaveBeenCalled();
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

    await fetcher({ tx: mockStoreParams.tx, ...pollingCallbacks });

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

      await fetcher({ tx: mockStoreParams.tx, ...pollingCallbacks });

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

    await fetcher({ tx: mockStoreParams.tx, ...pollingCallbacks });

    expect(pollingCallbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
  });

  test('should throw an error if the fetch response is not ok (and not 404)', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response);

    const pollingCallbacks = {
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      stopPolling: vi.fn(),
    };

    // We expect the fetcher to throw so that the polling tracker can handle the retry.
    await expect(fetcher({ tx: mockStoreParams.tx, ...pollingCallbacks })).rejects.toThrow();
  });
});
