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
import { Config } from '@wagmi/core';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { erc4337Fetcher, Erc4337FetchResult, erc4337TrackerForStore } from './erc4337Tracker';
import { evmTracker } from './evmTracker';

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

// Mock evmTracker for Stage 2 on-chain testing
vi.mock('./evmTracker', () => ({
  evmTracker: vi.fn(),
}));

// Mock viem/actions getBlock
vi.mock('viem/actions', () => ({
  getBlock: vi.fn().mockResolvedValue({ timestamp: 1700000042n }),
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
      requiredConfirmations: 2,
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

    test('should treat UserOperationReceiptNotFoundError as pending without throwing or stopping', async () => {
      const notFoundError = new Error('User Operation receipt with hash "0x1111" could not be found.');
      notFoundError.name = 'UserOperationReceiptNotFoundError';
      mockGetUserOperationReceipt.mockRejectedValueOnce(notFoundError);

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

    test('should trigger onSuccess and stopPolling WITH withoutRemoving: true when UserOperation succeeded', async () => {
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

      expect(stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
      expect(onSuccess).toHaveBeenCalledWith({
        receipt: mockReceipt,
        status: 'success',
        hash: mockReceipt.receipt.transactionHash,
      });
      expect(onFailure).not.toHaveBeenCalled();
    });

    test('should trigger onFailure and stopPolling WITH withoutRemoving: true when UserOperation reverted', async () => {
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

      expect(stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
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
      TrackerCallbacks<EvmTransaction> & { tx: EvmTransaction; config?: Config };

    let mockParams: MockStoreParams;
    const mockConfig = {} as Config;

    beforeEach(() => {
      mockParams = {
        tx: mockTx,
        config: mockConfig,
        transactionsPool: { [mockTx.txKey]: mockTx },
        updateTxParams: vi.fn(),
        onSuccess: vi.fn(),
        onError: vi.fn(),
        onReplaced: vi.fn(),
        removeTxFromPool: vi.fn(),
      };
    });

    test('should initialize polling without passing removeTxFromPool to prevent pool eviction', async () => {
      await erc4337TrackerForStore(mockParams);

      const callArg = vi.mocked(initializePollingTracker).mock.calls[0][0];
      expect(callArg.removeTxFromPool).toBeUndefined();
    });

    test('should execute Two-Stage tracking: update hash and delegate to evmTracker for Stage 2', async () => {
      await erc4337TrackerForStore(mockParams);

      const pollingConfig = vi.mocked(initializePollingTracker).mock.calls[0][0] as unknown as {
        onSuccess: (res: Erc4337FetchResult) => Promise<void>;
      };

      const onChainTxHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

      // Simulate Stage 1 success: Bundler returns on-chain hash
      await pollingConfig.onSuccess({
        receipt: null,
        status: 'success',
        hash: onChainTxHash,
      });

      // 1. Must immediately commit on-chain hash
      expect(mockParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
        hash: onChainTxHash,
      });

      // 2. Must delegate to evmTracker with txKey = onChainTxHash
      expect(evmTracker).toHaveBeenCalledWith(
        expect.objectContaining({
          tx: {
            chainId: mockTx.chainId,
            txKey: onChainTxHash,
            requiredConfirmations: mockTx.requiredConfirmations,
          },
          config: mockConfig,
        }),
      );

      // Simulate Stage 2 callbacks from evmTracker
      const evmParams = vi.mocked(evmTracker).mock.calls[0][0];

      // On tx details fetched
      evmParams.onTxDetailsFetched({
        to: '0x1234567890123456789012345678901234567890',
        input: '0xabcdef',
        nonce: 5,
        maxFeePerGas: 2000000000n,
        maxPriorityFeePerGas: 1000000000n,
      } as unknown as Parameters<typeof evmParams.onTxDetailsFetched>[0]);

      expect(mockParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
        to: '0x1234567890123456789012345678901234567890',
        input: '0xabcdef',
        value: undefined,
        nonce: 5,
        maxFeePerGas: '2000000000',
        maxPriorityFeePerGas: '1000000000',
      });

      // On confirmations update
      evmParams.onConfirmationsUpdate?.(2);
      expect(mockParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
        confirmations: 2,
      });

      // On Stage 2 success
      await evmParams.onSuccess(
        {} as unknown as Parameters<typeof evmParams.onSuccess>[0],
        { status: 'success', blockNumber: 123456n } as unknown as Parameters<typeof evmParams.onSuccess>[1],
        {} as unknown as Parameters<typeof evmParams.onSuccess>[2],
      );

      expect(mockParams.updateTxParams).toHaveBeenCalledWith(mockTx.txKey, {
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
        hash: onChainTxHash,
        finishedTimestamp: 1700000042,
      });

      expect(mockParams.onSuccess).toHaveBeenCalledWith(mockParams.transactionsPool[mockTx.txKey]);
    });

    test('should resume directly at Stage 2 if tx.hash is already populated (session restoration)', async () => {
      const restoredTx: EvmTransaction = {
        ...mockTx,
        hash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      };

      await erc4337TrackerForStore({
        ...mockParams,
        tx: restoredTx,
      });

      // Stage 1 (Bundler polling) must NOT be started
      expect(initializePollingTracker).not.toHaveBeenCalled();

      // Stage 2 (EVM tracking) must be invoked immediately
      expect(evmTracker).toHaveBeenCalledWith(
        expect.objectContaining({
          tx: {
            chainId: restoredTx.chainId,
            txKey: restoredTx.hash,
            requiredConfirmations: restoredTx.requiredConfirmations,
          },
          config: mockConfig,
        }),
      );
    });

    test('should update hash on onIntervalTick when hash is present', async () => {
      await erc4337TrackerForStore(mockParams);

      const config = vi.mocked(initializePollingTracker).mock.calls[0][0] as unknown as {
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

    test('should update store on failure and invoke onError callback', async () => {
      await erc4337TrackerForStore(mockParams);

      const config = vi.mocked(initializePollingTracker).mock.calls[0][0] as unknown as {
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
