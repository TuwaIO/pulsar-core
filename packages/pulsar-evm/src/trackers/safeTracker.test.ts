/**
 * @file Unit tests for the Safe transaction tracker.
 * This file tests the core fetcher logic (`fetchTxFromSafeAPI`) by mocking the Safe Transaction Service API responses.
 * @vitest-environment jsdom
 */

import { initializePollingTracker } from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { zeroAddress, zeroHash } from 'viem';
import { sepolia } from 'viem/chains';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { fetchTxFromSafeAPI, safeTracker, SafeTrackerParams, SafeTxStatusResponse } from './safeTracker';

// Mock the core polling utility to isolate the tracker's logic.
vi.mock('@tuwaio/pulsar-core', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/pulsar-core')>();
  return {
    ...original,
    initializePollingTracker: vi.fn(),
  };
});

// --- Test Data and Helpers ---

const mockTx = {
  txKey: '0x91d23240ffbf66a85d3e6057ca9d7826b47de1095a0e85f3d65a113ddfe48ee9',
  from: zeroAddress,
  chainId: sepolia.id,
};

const createMockSafeResponse = (overrides: Partial<SafeTxStatusResponse> = {}): SafeTxStatusResponse => ({
  transactionHash: zeroHash,
  safeTxHash: mockTx.txKey,
  isExecuted: false,
  isSuccessful: null,
  submissionDate: dayjs().toISOString(),
  executionDate: null,
  modified: dayjs().toISOString(),
  nonce: 1,
  ...overrides,
});

// Helper to mock the two sequential fetch calls required by the Safe tracker.
const mockSafeApiFetches = (
  primaryTxData: SafeTxStatusResponse,
  nonceTxsData: { count: number; results: SafeTxStatusResponse[] },
) => {
  vi.mocked(fetch)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => primaryTxData,
    } as Response)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => nonceTxsData,
    } as Response);
};

describe('safeTracker', () => {
  test('should call initializePollingTracker with the correct fetcher and parameters', async () => {
    const mockParams: SafeTrackerParams = {
      tx: mockTx,
      onSucceed: vi.fn(),
      onFailed: vi.fn(),
    };

    await safeTracker(mockParams);

    // Verify that the main polling function is called with our Safe-specific fetcher.
    expect(initializePollingTracker).toHaveBeenCalledTimes(1);
    expect(vi.mocked(initializePollingTracker).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        ...mockParams,
        fetcher: fetchTxFromSafeAPI,
      }),
    );
  });
});

describe('fetchTxFromSafeAPI', () => {
  const mockFetcherParams = {
    tx: mockTx,
    onSucceed: vi.fn(),
    onFailed: vi.fn(),
    onReplaced: vi.fn(),
    onIntervalTick: vi.fn(),
    clearWatch: vi.fn(),
  };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test.each([
    { status: 'successful', isSuccessful: true, callback: 'onSucceed' },
    { status: 'failed', isSuccessful: false, callback: 'onFailed' },
  ])('should call $callback when the transaction is executed and $status', async ({ isSuccessful, callback }) => {
    const primaryResponse = createMockSafeResponse({ isExecuted: true, isSuccessful });
    mockSafeApiFetches(primaryResponse, { count: 1, results: [primaryResponse] });

    await fetchTxFromSafeAPI(mockFetcherParams as any);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(mockFetcherParams[callback]).toHaveBeenCalledWith(primaryResponse);
    expect(mockFetcherParams.clearWatch).toHaveBeenCalledWith(true);
    // Ensure other terminal callbacks were not called.
    const otherCallback = callback === 'onSucceed' ? 'onFailed' : 'onSucceed';
    expect(mockFetcherParams[otherCallback]).not.toHaveBeenCalled();
  });

  test('should call onReplaced when another transaction with the same nonce is executed', async () => {
    const primaryResponse = createMockSafeResponse({ isExecuted: false }); // Our tx is still pending.
    const replacedTxHash = '0xREPLACED_SAFE_TX_HASH';
    const executedTx = createMockSafeResponse({
      isExecuted: true,
      isSuccessful: true,
      safeTxHash: replacedTxHash,
    });
    mockSafeApiFetches(primaryResponse, { count: 2, results: [primaryResponse, executedTx] });

    await fetchTxFromSafeAPI(mockFetcherParams as any);

    expect(mockFetcherParams.onReplaced).toHaveBeenCalledWith({
      ...primaryResponse,
      replacedHash: replacedTxHash,
    });
    expect(mockFetcherParams.clearWatch).toHaveBeenCalledWith(true);
    expect(mockFetcherParams.onSucceed).not.toHaveBeenCalled();
    expect(mockFetcherParams.onFailed).not.toHaveBeenCalled();
  });

  test('should only call onIntervalTick when the transaction is still pending', async () => {
    const primaryResponse = createMockSafeResponse({ isExecuted: false });
    mockSafeApiFetches(primaryResponse, { count: 1, results: [primaryResponse] });

    await fetchTxFromSafeAPI(mockFetcherParams as any);

    expect(mockFetcherParams.onIntervalTick).toHaveBeenCalledWith(primaryResponse);
    expect(mockFetcherParams.clearWatch).not.toHaveBeenCalled();
    expect(mockFetcherParams.onSucceed).not.toHaveBeenCalled();
    expect(mockFetcherParams.onFailed).not.toHaveBeenCalled();
    expect(mockFetcherParams.onReplaced).not.toHaveBeenCalled();
  });

  test('should call clearWatch for a stale pending transaction', async () => {
    const oldDate = dayjs().subtract(2, 'days').toISOString();
    const primaryResponse = createMockSafeResponse({ isExecuted: false, modified: oldDate });
    mockSafeApiFetches(primaryResponse, { count: 1, results: [primaryResponse] });

    await fetchTxFromSafeAPI(mockFetcherParams as any);

    expect(mockFetcherParams.clearWatch).toHaveBeenCalledWith(); // No `true`, so it gets removed from the pool.
    expect(mockFetcherParams.onIntervalTick).not.toHaveBeenCalled(); // Should clear before the interval tick.
  });

  test('should not proceed if the primary fetch fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response);

    await fetchTxFromSafeAPI(mockFetcherParams as any);

    expect(fetch).toHaveBeenCalledTimes(1); // The second fetch should not be called.
    expect(mockFetcherParams.onIntervalTick).not.toHaveBeenCalled();
  });

  test('should not proceed if the secondary (nonce) fetch fails', async () => {
    const primaryResponse = createMockSafeResponse();
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => primaryResponse } as Response)
      .mockResolvedValueOnce({ ok: false } as Response); // Nonce fetch fails.

    await fetchTxFromSafeAPI(mockFetcherParams as any);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(mockFetcherParams.onIntervalTick).not.toHaveBeenCalled();
  });
});
