/**
 * @file Unit tests for checkAndInitializeTrackerInStore.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { EvmTransaction, TransactionStatus, TransactionTracker } from '@tuwaio/pulsar-core';
import { Config } from '@wagmi/core';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { eip5792TrackerForStore } from '../trackers/eip5792Tracker';
import { erc4337TrackerForStore } from '../trackers/erc4337Tracker';
import { evmTrackerForStore } from '../trackers/evmTracker';
import { safeTrackerForStore } from '../trackers/safeTracker';
import { checkAndInitializeTrackerInStore } from './checkAndInitializeTrackerInStore';

vi.mock('../trackers/evmTracker', () => ({
  evmTrackerForStore: vi.fn(),
}));
vi.mock('../trackers/safeTracker', () => ({
  safeTrackerForStore: vi.fn(),
}));
vi.mock('../trackers/eip5792Tracker', () => ({ eip5792TrackerForStore: vi.fn() }));
vi.mock('../trackers/erc4337Tracker', () => ({
  erc4337TrackerForStore: vi.fn(),
}));

describe('checkAndInitializeTrackerInStore', () => {
  const mockConfig = {} as Config;
  let mockTx: EvmTransaction;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(evmTrackerForStore).mockResolvedValue(undefined);
    mockTx = {
      txKey: '0x1111111111111111111111111111111111111111111111111111111111111111',
      chainId: 1,
      from: '0x0000000000000000000000000000000000000001',
      type: 'TEST',
      connectorType: 'injected',
      tracker: TransactionTracker.Ethereum,
      pending: true,
      adapter: OrbitAdapter.EVM,
      localTimestamp: 1700000000,
    };
  });

  test('resolves once the tracker has started: nothing should wait for a transaction that may stay pending', async () => {
    vi.mocked(evmTrackerForStore).mockReturnValue(new Promise(() => {}));

    await expect(
      checkAndInitializeTrackerInStore({
        tracker: TransactionTracker.Ethereum,
        tx: mockTx,
        config: mockConfig,
        transactionsPool: {},
        updateTxParams: vi.fn(),
        removeTxFromPool: vi.fn(),
      }),
    ).resolves.toBeUndefined();
  });

  test('an error of the tracker running in the background is logged, not left unhandled', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(evmTrackerForStore).mockRejectedValue(new TypeError('bug'));

    await checkAndInitializeTrackerInStore({
      tracker: TransactionTracker.Ethereum,
      tx: mockTx,
      config: mockConfig,
      transactionsPool: {},
      updateTxParams: vi.fn(),
      removeTxFromPool: vi.fn(),
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(error).toHaveBeenCalledWith(expect.stringContaining('TypeError'));
    error.mockRestore();
  });

  test('should delegate to evmTrackerForStore for Ethereum tracker', async () => {
    await checkAndInitializeTrackerInStore({
      tracker: TransactionTracker.Ethereum,
      tx: mockTx,
      config: mockConfig,
      transactionsPool: {},
      updateTxParams: vi.fn(),
      removeTxFromPool: vi.fn(),
    });

    expect(evmTrackerForStore).toHaveBeenCalled();
  });

  test('should delegate to erc4337TrackerForStore for ERC4337 tracker', async () => {
    await checkAndInitializeTrackerInStore({
      tracker: TransactionTracker.ERC4337,
      tx: { ...mockTx, tracker: TransactionTracker.ERC4337 },
      config: mockConfig,
      transactionsPool: {},
      updateTxParams: vi.fn(),
      removeTxFromPool: vi.fn(),
    });

    expect(erc4337TrackerForStore).toHaveBeenCalled();
  });

  test('should delegate to eip5792TrackerForStore with the wagmi config for EIP5792 tracker', async () => {
    await checkAndInitializeTrackerInStore({
      tracker: TransactionTracker.EIP5792,
      tx: { ...mockTx, tracker: TransactionTracker.EIP5792 },
      config: mockConfig,
      transactionsPool: {},
      updateTxParams: vi.fn(),
      removeTxFromPool: vi.fn(),
    });

    expect(eip5792TrackerForStore).toHaveBeenCalledWith(expect.objectContaining({ config: mockConfig }));
  });

  // Pulsar no longer reads Gelato. A task ID is no hash: followed by the EVM tracker, a task an older version saved stayed pending for good
  test('should end a Gelato relay task an older version saved, saying why', async () => {
    const updateTxParams = vi.fn();
    await checkAndInitializeTrackerInStore({
      tracker: 'gelato' as TransactionTracker,
      tx: { ...mockTx, tracker: 'gelato' as TransactionTracker },
      config: mockConfig,
      transactionsPool: {},
      updateTxParams,
      removeTxFromPool: vi.fn(),
    });

    expect(evmTrackerForStore).not.toHaveBeenCalled();
    expect(updateTxParams).toHaveBeenCalledWith(
      mockTx.txKey,
      expect.objectContaining({
        status: TransactionStatus.Failed,
        pending: false,
        isError: true,
        error: { message: expect.stringContaining('Gelato') },
      }),
    );
  });

  test('should delegate to safeTrackerForStore for Safe tracker', async () => {
    await checkAndInitializeTrackerInStore({
      tracker: TransactionTracker.Safe,
      tx: { ...mockTx, tracker: TransactionTracker.Safe },
      config: mockConfig,
      transactionsPool: {},
      updateTxParams: vi.fn(),
      removeTxFromPool: vi.fn(),
    });

    expect(safeTrackerForStore).toHaveBeenCalled();
  });

  test('passes the Safe timeout of the adapter to the Safe tracker', async () => {
    await checkAndInitializeTrackerInStore({
      tracker: TransactionTracker.Safe,
      tx: { ...mockTx, tracker: TransactionTracker.Safe },
      config: mockConfig,
      transactionsPool: {},
      updateTxParams: vi.fn(),
      removeTxFromPool: vi.fn(),
      safePendingTimeoutMs: null,
    });

    expect(safeTrackerForStore).toHaveBeenCalledWith(expect.objectContaining({ pendingTimeoutMs: null }));
  });
});
