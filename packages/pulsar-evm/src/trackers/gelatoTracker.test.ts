/**
 * @file Unit tests for the Gelato transaction tracker.
 * This file tests the high-level `gelatoTrackerForStore` function and the `gelatoFetcher` factory.
 * It mocks the core `initializePollingTracker` utility and the `createGelatoClient` transport
 * to inspect the fetcher's behavior in response to various simulated Gelato RPC status codes.
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

import { gelatoFetcher, GelatoStatusCode, GelatoTaskStatus, gelatoTrackerForStore } from './gelatoTracker';

// Mock the core polling utility to isolate the gelatoTracker logic.
vi.mock('@tuwaio/pulsar-core', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/pulsar-core')>();
  return {
    ...original,
    initializePollingTracker: vi.fn(),
  };
});

// Mock createGelatoClient to return a controllable mock transport.
const mockRequest = vi.fn();
vi.mock('../utils/createGelatoClient', () => ({
  createGelatoClient: vi.fn(() => ({
    request: mockRequest,
  })),
}));

// =================================================================================================
// HELPERS
// =================================================================================================

/** Creates a mock Gelato RPC response for the given status code. */
const createMockStatus = (status: GelatoStatusCode, overrides?: Partial<GelatoTaskStatus>): GelatoTaskStatus => {
  const base = {
    chainId: 1,
    createdAt: dayjs().unix(),
    id: '0x123abc-test-task',
  };

  switch (status) {
    case GelatoStatusCode.Pending:
      return { ...base, status: GelatoStatusCode.Pending, ...overrides } as GelatoTaskStatus;
    case GelatoStatusCode.Submitted:
      return { ...base, status: GelatoStatusCode.Submitted, hash: zeroHash, ...overrides } as GelatoTaskStatus;
    case GelatoStatusCode.Success:
      return {
        ...base,
        status: GelatoStatusCode.Success,
        receipt: { transactionHash: zeroHash },
        ...overrides,
      } as GelatoTaskStatus;
    case GelatoStatusCode.Rejected:
      return {
        ...base,
        status: GelatoStatusCode.Rejected,
        message: 'Rejected by relayer',
        ...overrides,
      } as GelatoTaskStatus;
    case GelatoStatusCode.Reverted:
      return {
        ...base,
        status: GelatoStatusCode.Reverted,
        message: 'Transaction reverted',
        data: '0x',
        receipt: { transactionHash: zeroHash },
        ...overrides,
      } as GelatoTaskStatus;
    default:
      return { ...base, status, ...overrides } as GelatoTaskStatus;
  }
};

type MockParams = Pick<ITxTrackingStore<Transaction>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'> &
  TrackerCallbacks<Transaction> & { tx: Transaction; gelatoApiKey: string };

// =================================================================================================
// TESTS
// =================================================================================================

describe('gelatoFetcher', () => {
  let mockTx: Transaction;
  let fetcher: PollingTrackerConfig<GelatoTaskStatus, Transaction>['fetcher'];

  beforeEach(() => {
    mockTx = { txKey: '0x123abc-test-task', pending: true } as Transaction;

    // Create a fetcher with the mock client (mockRequest is already wired via the vi.mock above).
    fetcher = gelatoFetcher({ request: mockRequest } as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call onSuccess when status is Success (200)', async () => {
    const mockResponse = createMockStatus(GelatoStatusCode.Success);
    mockRequest.mockResolvedValue(mockResponse);

    const pollingCallbacks = {
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      onIntervalTick: vi.fn(),
      stopPolling: vi.fn(),
    };

    await fetcher({ tx: mockTx, ...pollingCallbacks });

    expect(pollingCallbacks.onSuccess).toHaveBeenCalledWith(mockResponse);
    expect(pollingCallbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
    expect(pollingCallbacks.onFailure).not.toHaveBeenCalled();
  });

  test('should call onFailure when status is Rejected (400)', async () => {
    const mockResponse = createMockStatus(GelatoStatusCode.Rejected);
    mockRequest.mockResolvedValue(mockResponse);

    const pollingCallbacks = {
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      onIntervalTick: vi.fn(),
      stopPolling: vi.fn(),
    };

    await fetcher({ tx: mockTx, ...pollingCallbacks });

    expect(pollingCallbacks.onFailure).toHaveBeenCalledWith(mockResponse);
    expect(pollingCallbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
    expect(pollingCallbacks.onSuccess).not.toHaveBeenCalled();
  });

  test('should call onFailure when status is Reverted (500)', async () => {
    const mockResponse = createMockStatus(GelatoStatusCode.Reverted);
    mockRequest.mockResolvedValue(mockResponse);

    const pollingCallbacks = {
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      onIntervalTick: vi.fn(),
      stopPolling: vi.fn(),
    };

    await fetcher({ tx: mockTx, ...pollingCallbacks });

    expect(pollingCallbacks.onFailure).toHaveBeenCalledWith(mockResponse);
    expect(pollingCallbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
    expect(pollingCallbacks.onSuccess).not.toHaveBeenCalled();
  });

  test.each([
    ['Pending', GelatoStatusCode.Pending],
    ['Submitted', GelatoStatusCode.Submitted],
  ] as const)('should only call onIntervalTick for non-terminal state: %s (%d)', async (_label, statusCode) => {
    const mockResponse = createMockStatus(statusCode);
    mockRequest.mockResolvedValue(mockResponse);

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
  });

  test('should call stopPolling if a task is stale (older than 1 hour)', async () => {
    const oldCreatedAt = dayjs().subtract(2, 'hours').unix();
    const mockResponse = createMockStatus(GelatoStatusCode.Pending, { createdAt: oldCreatedAt });
    mockRequest.mockResolvedValue(mockResponse);

    const pollingCallbacks = {
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      onIntervalTick: vi.fn(),
      stopPolling: vi.fn(),
    };

    await fetcher({ tx: mockTx, ...pollingCallbacks });

    expect(pollingCallbacks.stopPolling).toHaveBeenCalledWith();
  });

  test('should propagate errors from the RPC client for retry handling', async () => {
    mockRequest.mockRejectedValue(new Error('RPC error: unauthorized'));

    const pollingCallbacks = {
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      onIntervalTick: vi.fn(),
      stopPolling: vi.fn(),
    };

    await expect(fetcher({ tx: mockTx, ...pollingCallbacks })).rejects.toThrow('RPC error: unauthorized');
  });
});

describe('gelatoTrackerForStore', () => {
  let mockTx: Transaction;
  let mockParams: MockParams;

  beforeEach(() => {
    mockTx = { txKey: '0x123abc-test-task', pending: true } as Transaction;

    mockParams = {
      tx: mockTx,
      gelatoApiKey: 'test-api-key',
      transactionsPool: { [mockTx.txKey]: mockTx },
      updateTxParams: vi.fn() as unknown as ITxTrackingStore<Transaction>['updateTxParams'],
      onSuccess: vi.fn() as unknown as TrackerCallbacks<Transaction>['onSuccess'],
      onError: vi.fn() as unknown as TrackerCallbacks<Transaction>['onError'],
      removeTxFromPool: vi.fn() as unknown as ITxTrackingStore<Transaction>['removeTxFromPool'],
    };

    gelatoTrackerForStore(mockParams);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call user onSuccess callback when transaction succeeds', () => {
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    const mockResponse = createMockStatus(GelatoStatusCode.Success);
    config.onSuccess(mockResponse);

    expect(mockParams.updateTxParams).toHaveBeenCalledWith(
      mockTx.txKey,
      expect.objectContaining({
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
        hash: zeroHash,
      }),
    );
    expect(mockParams.onSuccess).toHaveBeenCalledWith(expect.objectContaining({ txKey: mockTx.txKey }));
  });

  test('should update hash on onIntervalTick when status is Submitted', () => {
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    const mockResponse = createMockStatus(GelatoStatusCode.Submitted);
    config.onIntervalTick!(mockResponse);

    expect(mockParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, { hash: zeroHash });
  });

  test('should NOT update hash on onIntervalTick when status is Pending', () => {
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    const mockResponse = createMockStatus(GelatoStatusCode.Pending);
    config.onIntervalTick!(mockResponse);

    expect(mockParams.updateTxParams).not.toHaveBeenCalled();
  });

  test('should call user onError callback when transaction is rejected', () => {
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    const mockResponse = createMockStatus(GelatoStatusCode.Rejected);
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

  test('should include revert hash when transaction reverts', () => {
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    const mockResponse = createMockStatus(GelatoStatusCode.Reverted);
    config.onFailure(mockResponse);

    expect(mockParams.updateTxParams).toHaveBeenCalledWith(
      mockTx.txKey,
      expect.objectContaining({
        status: TransactionStatus.Failed,
        hash: zeroHash,
      }),
    );
  });

  test('should handle onFailure with no response (e.g., max retries exceeded)', () => {
    const config = vi.mocked(initializePollingTracker).mock.calls[0][0];

    config.onFailure(undefined);

    expect(mockParams.updateTxParams).toHaveBeenCalledWith(
      mockTx.txKey,
      expect.objectContaining({
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        hash: undefined,
      }),
    );
    expect(mockParams.onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Transaction failed or was not found.' }),
      expect.objectContaining({ txKey: mockTx.txKey }),
    );
  });
});
