/**
 * @file Unit tests for pulsarSolanaAdapter.
 */

import { lastConnectedConnectorHelpers, OrbitAdapter } from '@tuwaio/orbit-core';
import { createPulsarStore, SolanaTransaction, TransactionTracker, TxAdapter } from '@tuwaio/pulsar-core';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { createJSONStorage } from 'zustand/middleware';

import { SolanaChainMismatchError } from '../errors';
import { pulsarSolanaAdapter } from './solanaAdapter';

vi.mock('@tuwaio/orbit-solana', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/orbit-solana')>();
  return {
    ...original,
    getConnectedSolanaConnector: vi.fn(() => ({ name: 'Phantom', accounts: [] })),
    getAvailableSolanaConnectors: vi.fn(() => [{ name: 'Phantom', accounts: [{ address: 'Addr' }] }]),
  };
});

describe('pulsarSolanaAdapter', () => {
  const adapter = pulsarSolanaAdapter({
    rpcUrls: {
      devnet: 'https://api.devnet.solana.com',
    },
  });

  test('should have key OrbitAdapter.SOLANA', () => {
    expect(adapter.key).toBe(OrbitAdapter.SOLANA);
  });

  test('checkTransactionsTracker should return default Solana tracker if none specified', () => {
    const result = adapter.checkTransactionsTracker({
      actionTxKey: '5U3b...sig',
      connectorType: 'phantom',
    });

    expect(result).toEqual({
      tracker: TransactionTracker.Solana,
      txKey: '5U3b...sig',
    });
  });

  test('getExplorerUrl should format solana explorer url', () => {
    const url = adapter.getExplorerUrl('5U3b...sig', 'solana:devnet');
    expect(typeof url).toBe('string');
    expect(url).toContain('solana.com');
  });

  describe('checkChainForTx', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    const connectTo = (chainId: string) =>
      vi
        .spyOn(lastConnectedConnectorHelpers, 'getLastConnectedConnector')
        .mockReturnValue({ connectorType: 'solana:phantom', chainId, address: 'Addr' });

    test('accepts the same cluster with or without the solana: prefix', async () => {
      connectTo('devnet');
      await expect(adapter.checkChainForTx('devnet')).resolves.toBeUndefined();
      await expect(adapter.checkChainForTx('solana:devnet')).resolves.toBeUndefined();

      connectTo('solana:devnet');
      await expect(adapter.checkChainForTx('devnet')).resolves.toBeUndefined();
    });

    test('accepts the genesis-hash chain ID and mainnet-beta of the connected cluster', async () => {
      connectTo('devnet');
      await expect(adapter.checkChainForTx('solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1')).resolves.toBeUndefined();

      connectTo('mainnet');
      await expect(adapter.checkChainForTx('solana:mainnet-beta')).resolves.toBeUndefined();
      await expect(adapter.checkChainForTx('solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp')).resolves.toBeUndefined();
    });

    test('rejects the genesis-hash chain ID of another cluster', async () => {
      connectTo('mainnet');
      await expect(adapter.checkChainForTx('solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1')).rejects.toMatchObject({
        requiredChain: 'devnet',
        currentChain: 'mainnet',
      });
    });

    test('rejects when the connection has no saved chain instead of assuming mainnet', async () => {
      connectTo('');
      await expect(adapter.checkChainForTx('mainnet')).rejects.toBeInstanceOf(SolanaChainMismatchError);
    });

    test('rejects another cluster with SolanaChainMismatchError', async () => {
      connectTo('mainnet');
      await expect(adapter.checkChainForTx('solana:devnet')).rejects.toBeInstanceOf(SolanaChainMismatchError);
    });
  });

  // A record from another device or a server has no endpoint, and one on the record could hold a key
  test('tracks on the URL of the cluster in rpcUrls, without writing it to the record', async () => {
    const updateTxParams = vi.fn();
    const seen: string[] = [];
    await adapter.checkAndInitializeTrackerInStore({
      tx: {
        adapter: OrbitAdapter.SOLANA,
        txKey: 'sig',
        chainId: 'solana:devnet',
        tracker: TransactionTracker.Solana,
        pending: true,
        localTimestamp: Math.floor(Date.now() / 1000),
        from: 'a',
        type: 't',
        connectorType: 'c',
      } as never,
      transactionsPool: {},
      updateTxParams,
      removeTxFromPool: vi.fn(),
      isTxTracked: () => {
        seen.push('checked');
        return false;
      },
    } as never);
    for (const call of updateTxParams.mock.calls) expect(call[1]).not.toHaveProperty('rpcUrl');
  });
});

describe('pulsarSolanaAdapter.retryTxAction', () => {
  // A Retry comes back with the action of the first call and nothing else of it: the next step of an app never ran, and
  // its session check was skipped
  test('keeps the callbacks and the check of the call it repeats, through the real store', async () => {
    const signature = '5U3bSig';
    const startTracker = vi.fn().mockResolvedValue(undefined);
    const retrying: TxAdapter<SolanaTransaction> = {
      ...pulsarSolanaAdapter<SolanaTransaction>({ rpcUrls: { devnet: 'https://api.devnet.solana.com' } }),
      getConnectorInfo: () => ({ walletAddress: 'Addr', connectorType: 'solana:phantom' }),
      checkChainForTx: vi.fn().mockResolvedValue(undefined),
      checkAndInitializeTrackerInStore: startTracker,
    };
    const saved = new Map<string, string>();
    const store = createPulsarStore<SolanaTransaction>({
      name: 'solana-retry',
      adapter: retrying,
      storage: createJSONStorage(() => ({
        getItem: (key) => saved.get(key) ?? null,
        setItem: (key, value) => void saved.set(key, value),
        removeItem: (key) => void saved.delete(key),
      })),
    });
    const params = {
      adapter: OrbitAdapter.SOLANA,
      desiredChainID: 'devnet',
      title: 'Swap',
      description: 'Swap tokens',
      type: 'SWAP',
    };
    const onSuccess = vi.fn();
    const beforeTxProcess = vi.fn();
    const action = vi.fn().mockRejectedValueOnce(new Error('rejected')).mockResolvedValueOnce(signature);

    await expect(
      store.getState().executeTxAction({ actionFunction: action, params, onSuccess, beforeTxProcess }),
    ).rejects.toThrow('rejected');

    await retrying.retryTxAction?.({
      tx: { ...params, actionFunction: store.getState().initialTx!.actionFunction },
      txKey: '',
      onClose: vi.fn(),
      executeTxAction: store.getState().executeTxAction,
    });

    expect(beforeTxProcess).toHaveBeenCalledTimes(2);
    const tx = store.getState().transactionsPool[signature];
    expect(tx).not.toHaveProperty('actionFunction');
    startTracker.mock.lastCall?.[0].onSuccess?.(tx);
    expect(onSuccess).toHaveBeenCalledWith(tx);
  });
});
