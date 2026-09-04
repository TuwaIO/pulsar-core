/**
 * @file Unit tests for ERC-4337 UserOperation tracker.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import {
  EvmTransaction,
  initializePollingTracker,
  ITxTrackingStore,
  TrackerCallbacks,
  TransactionStatus,
  TransactionTracker,
} from '@tuwaio/pulsar-core';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { erc4337Fetcher, Erc4337FetchResult, erc4337TrackerForStore } from './erc4337Tracker';

// Mock the core polling utility to isolate tracker logic
vi.mock('@tuwaio/pulsar-core', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/pulsar-core')>();
  return {
    ...original,
    initializePollingTracker: vi.fn(),
  };
});

// Mock @tuwaio/orbit-evm's createBundlerRpcClient
const mockGetUserOperationReceipt = vi.fn();
vi.mock('@tuwaio/orbit-evm', () => ({
  createBundlerRpcClient: vi.fn(() => ({
    getUserOperationReceipt: mockGetUserOperationReceipt,
  })),
}));

describe('erc4337Tracker', () => {
  let mockTx: EvmTransaction;

  beforeEach(() => {
    vi.clearAllMocks();
    mockTx = {
      txKey: '0x1111111111111111111111111111111111111111111111111111111111111111',
      chainId: 1,
      from: '0x0000000000000000000000000000000000000001',
      type: 'USER_OP',
      connectorType: 'smart-account',
      tracker: TransactionTracker.ERC4337,
      pending: true,
      adapter: OrbitAdapter.EVM,
      localTimestamp: 1700000000,
      pimlicoApiKey: 'test-pimlico-key',
    };
  });

  describe('erc4337Fetcher', () => {
    test('should trigger onIntervalTick when UserOperation is still pending (receipt is null)', async () => {
      mockGetUserOperationReceipt.mockResolvedValueOnce(null);

      const stopPolling = vi.fn();
      const onSuccess = vi.fn();
      const onFailure = vi.fn();
      const onIntervalTick = vi.fn();

      await erc4337Fetcher({
        tx: mockTx,
        stopPolling,
        onSuccess,
        onFailure,
        onIntervalTick,
      });

      expect(onIntervalTick).toHaveBeenCalledWith({
        receipt: null,
        status: 'pending',
      });
      expect(stopPolling).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();
    });

    test('should trigger onSuccess and stopPolling when UserOperation succeeded', async () => {
      const mockReceipt = {
        success: true,
        userOpHash: mockTx.txKey,
        receipt: {
          transactionHash: '0x9999999999999999999999999999999999999999999999999999999999999999',
          blockNumber: 123456n,
        },
      };
      mockGetUserOperationReceipt.mockResolvedValueOnce(mockReceipt);

      const stopPolling = vi.fn();
      const onSuccess = vi.fn();
      const onFailure = vi.fn();

      await erc4337Fetcher({
        tx: mockTx,
        stopPolling,
        onSuccess,
        onFailure,
      });

      expect(stopPolling).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith({
        receipt: mockReceipt,
        status: 'success',
        hash: mockReceipt.receipt.transactionHash,
      });
      expect(onFailure).not.toHaveBeenCalled();
    });

    test('should trigger onFailure and stopPolling when UserOperation reverted', async () => {
      const mockReceipt = {
        success: false,
        userOpHash: mockTx.txKey,
        reason: 'AA21 prefund failed',
        receipt: {
          transactionHash: '0x8888888888888888888888888888888888888888888888888888888888888888',
        },
      };
      mockGetUserOperationReceipt.mockResolvedValueOnce(mockReceipt);

      const stopPolling = vi.fn();
      const onSuccess = vi.fn();
      const onFailure = vi.fn();

      await erc4337Fetcher({
        tx: mockTx,
        stopPolling,
        onSuccess,
        onFailure,
      });

      expect(stopPolling).toHaveBeenCalled();
      expect(onFailure).toHaveBeenCalledWith({
        receipt: mockReceipt,
        status: 'failed',
        hash: mockReceipt.receipt.transactionHash,
        reason: 'AA21 prefund failed',
      });
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe('erc4337TrackerForStore', () => {
    type MockStoreParams = Pick<
      ITxTrackingStore<EvmTransaction>,
      'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'
    > &
      TrackerCallbacks<EvmTransaction> & { tx: EvmTransaction };

    let mockParams: MockStoreParams;

    beforeEach(() => {
      mockParams = {
        tx: mockTx,
        transactionsPool: { [mockTx.txKey]: mockTx },
        updateTxParams: vi.fn(),
        onSuccess: vi.fn(),
        onError: vi.fn(),
        removeTxFromPool: vi.fn(),
      };

      erc4337TrackerForStore(mockParams);
    });

    test('should update store on success and invoke onSuccess callback', () => {
      const config = vi.mocked(initializePollingTracker).mock.calls[0][0] as {
        onSuccess: (res: Erc4337FetchResult) => void;
      };

      const txHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      config.onSuccess({
        receipt: null,
        status: 'success',
        hash: txHash,
      });

      expect(mockParams.updateTxParams).toHaveBeenCalledWith(
        mockTx.txKey,
        expect.objectContaining({
          status: TransactionStatus.Success,
          pending: false,
          isError: false,
          hash: txHash,
        }),
      );
      expect(mockParams.onSuccess).toHaveBeenCalledWith(mockParams.transactionsPool[mockTx.txKey]);
    });

    test('should update hash on onIntervalTick when hash is present', () => {
      const config = vi.mocked(initializePollingTracker).mock.calls[0][0] as {
        onIntervalTick: (res: Erc4337FetchResult) => void;
      };

      const txHash = '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc';
      config.onIntervalTick({
        receipt: null,
        status: 'pending',
        hash: txHash,
      });

      expect(mockParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
        hash: txHash,
      });
    });

    test('should update store on failure and invoke onError callback', () => {
      const config = vi.mocked(initializePollingTracker).mock.calls[0][0] as {
        onFailure: (res?: Erc4337FetchResult) => void;
      };

      config.onFailure({
        receipt: null,
        status: 'failed',
        reason: 'AA21 prefund failed',
      });

      expect(mockParams.updateTxParams).toHaveBeenCalledWith(
        mockTx.txKey,
        expect.objectContaining({
          status: TransactionStatus.Failed,
          pending: false,
          isError: true,
        }),
      );
      expect(mockParams.onError).toHaveBeenCalled();
    });
  });
});
