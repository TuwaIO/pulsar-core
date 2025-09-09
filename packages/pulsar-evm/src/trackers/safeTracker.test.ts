/**
 * @file Unit tests for the Safe transaction tracker.
 * This file tests the core fetcher logic (`safeFetcher`) and the store integration (`safeTrackerForStore`).
 * It mocks the Safe Transaction Service API responses to ensure tests are deterministic.
 * @vitest-environment jsdom
 */

import { initializePollingTracker } from '@tuwaio/pulsar-core';
import dayjs from 'dayjs';
import { Hex, zeroAddress, zeroHash } from 'viem';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { safeFetcher, safeTrackerForStore, SafeTxStatusResponse } from './safeTracker';

// Mock the core polling utility.
vi.mock('@tuwaio/pulsar-core', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/pulsar-core')>();
  return {
    ...original,
    initializePollingTracker: vi.fn(),
  };
});

// --- Test Data and Helpers ---

const mockTx = {
  txKey: '0x91d23240ffbf66a85d3e6057ca9d7826b47de1095a0e85f3d65a113ddfe48ee9' as Hex,
  from: zeroAddress,
  chainId: 1,
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

describe('safeTrackerForStore', () => {
  test('should call initializePollingTracker with the correct fetcher', async () => {
    const mockStoreParams = {
      tx: mockTx,
      updateTxParams: vi.fn(),
      onSucceedCallbacks: vi.fn(),
    };

    safeTrackerForStore(mockStoreParams as any);

    expect(initializePollingTracker).toHaveBeenCalledTimes(1);
    expect(vi.mocked(initializePollingTracker).mock.calls[0][0].fetcher).toBe(safeFetcher);
  });
});

describe('safeFetcher', () => {
  let pollingCallbacks: any;

  beforeEach(() => {
    global.fetch = vi.fn();
    pollingCallbacks = {
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      onReplaced: vi.fn(),
      onIntervalTick: vi.fn(),
      stopPolling: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call onSuccess if primary tx is executed successfully', async () => {
    const primaryResponse = createMockSafeResponse({ isExecuted: true, isSuccessful: true });
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => primaryResponse,
    } as Response);

    await safeFetcher({ tx: mockTx, ...pollingCallbacks });

    expect(pollingCallbacks.onSuccess).toHaveBeenCalledWith(primaryResponse);
    expect(fetch).toHaveBeenCalledTimes(1); // Should not make the second API call
  });

  test('should call onFailure if primary tx is executed but failed', async () => {
    const primaryResponse = createMockSafeResponse({ isExecuted: true, isSuccessful: false });
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => primaryResponse,
    } as Response);

    await safeFetcher({ tx: mockTx, ...pollingCallbacks });

    expect(pollingCallbacks.onFailure).toHaveBeenCalledWith(primaryResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('should call onReplaced if another tx with same nonce is executed', async () => {
    const primaryResponse = createMockSafeResponse({ isExecuted: false }); // Our tx is pending
    const executedTx = createMockSafeResponse({
      isExecuted: true,
      isSuccessful: true,
      safeTxHash: '0xREPLACED_SAFE_TX_HASH' as Hex,
    });

    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => primaryResponse } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [executedTx] }) } as Response);

    await safeFetcher({ tx: mockTx, ...pollingCallbacks });

    expect(pollingCallbacks.onReplaced).toHaveBeenCalledWith(executedTx);
    expect(pollingCallbacks.onSuccess).not.toHaveBeenCalled();
    expect(pollingCallbacks.onFailure).not.toHaveBeenCalled();
  });

  test('should only call onIntervalTick if tx is still pending and not replaced', async () => {
    const primaryResponse = createMockSafeResponse({ isExecuted: false });

    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => primaryResponse } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [primaryResponse] }) } as Response);

    await safeFetcher({ tx: mockTx, ...pollingCallbacks });

    expect(pollingCallbacks.onIntervalTick).toHaveBeenCalledWith(primaryResponse);
    expect(pollingCallbacks.onSuccess).not.toHaveBeenCalled();
    expect(pollingCallbacks.onFailure).not.toHaveBeenCalled();
    expect(pollingCallbacks.onReplaced).not.toHaveBeenCalled();
  });

  test('should call stopPolling for a stale pending transaction', async () => {
    const oldDate = dayjs().subtract(2, 'days').toISOString();
    const primaryResponse = createMockSafeResponse({ isExecuted: false, submissionDate: oldDate });

    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => primaryResponse } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [primaryResponse] }) } as Response);

    await safeFetcher({ tx: mockTx, ...pollingCallbacks });

    expect(pollingCallbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
  });

  test('should throw an error if the primary fetch fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);

    await expect(safeFetcher({ tx: mockTx, ...pollingCallbacks })).rejects.toThrow();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(pollingCallbacks.onSuccess).not.toHaveBeenCalled();
  });
});
