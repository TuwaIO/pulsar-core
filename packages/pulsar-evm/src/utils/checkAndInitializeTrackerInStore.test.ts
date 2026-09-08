/**
 * @file Unit tests for checkAndInitializeTrackerInStore.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { EvmTransaction, TransactionTracker } from '@tuwaio/pulsar-core';
import { Config } from '@wagmi/core';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { erc4337TrackerForStore } from '../trackers/erc4337Tracker';
import { evmTrackerForStore } from '../trackers/evmTracker';
import { gelatoTrackerForStore } from '../trackers/gelatoTracker';
import { safeTrackerForStore } from '../trackers/safeTracker';
import { checkAndInitializeTrackerInStore } from './checkAndInitializeTrackerInStore';

vi.mock('../trackers/evmTracker', () => ({
  evmTrackerForStore: vi.fn(),
}));
vi.mock('../trackers/gelatoTracker', () => ({
  gelatoTrackerForStore: vi.fn(),
}));
vi.mock('../trackers/safeTracker', () => ({
  safeTrackerForStore: vi.fn(),
}));
vi.mock('../trackers/erc4337Tracker', () => ({
  erc4337TrackerForStore: vi.fn(),
}));

describe('checkAndInitializeTrackerInStore', () => {
  const mockConfig = {} as Config;
  let mockTx: EvmTransaction;

  beforeEach(() => {
    vi.clearAllMocks();
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

  test('should delegate to gelatoTrackerForStore for Gelato tracker when apiKey is present', async () => {
    await checkAndInitializeTrackerInStore({
      tracker: TransactionTracker.Gelato,
      tx: { ...mockTx, tracker: TransactionTracker.Gelato },
      config: mockConfig,
      transactionsPool: {},
      updateTxParams: vi.fn(),
      removeTxFromPool: vi.fn(),
      gelatoApiKey: 'key-123',
    });

    expect(gelatoTrackerForStore).toHaveBeenCalled();
  });

  test('should fallback to evmTrackerForStore if Gelato tracker requested without apiKey', async () => {
    await checkAndInitializeTrackerInStore({
      tracker: TransactionTracker.Gelato,
      tx: { ...mockTx, tracker: TransactionTracker.Gelato },
      config: mockConfig,
      transactionsPool: {},
      updateTxParams: vi.fn(),
      removeTxFromPool: vi.fn(),
    });

    expect(evmTrackerForStore).toHaveBeenCalled();
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
});
