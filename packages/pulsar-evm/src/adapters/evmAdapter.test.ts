/**
 * @file Unit tests for the explorer links of `pulsarEvmAdapter`.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { createPulsarStore, EvmTransaction, TxAdapter } from '@tuwaio/pulsar-core';
import { type Config } from '@wagmi/core';
import { type Chain } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createJSONStorage } from 'zustand/middleware';

import { pulsarEvmAdapter } from './evmAdapter';

const getConnection = vi.fn();

vi.mock('@wagmi/core', async (importActual) => {
  const original = await importActual<typeof import('@wagmi/core')>();
  return { ...original, getConnection: (...args: unknown[]) => getConnection(...args) };
});

const noExplorerChain = { ...sepolia, id: 999_999, blockExplorers: undefined } as unknown as Chain;
const adapter = pulsarEvmAdapter({} as Config, [mainnet, sepolia, noExplorerChain]);

describe('pulsarEvmAdapter.getExplorerUrl', () => {
  beforeEach(() => {
    getConnection.mockReturnValue({ chain: mainnet });
  });

  test('uses the chain of chainId when it is passed', () => {
    expect(adapter.getExplorerUrl('/address/0x1', sepolia.id)).toBe('https://sepolia.etherscan.io/address/0x1');
  });

  test('uses the connected chain when chainId is omitted, without a double slash', () => {
    expect(adapter.getExplorerUrl('tx/0x1')).toBe('https://etherscan.io/tx/0x1');
    expect(adapter.getExplorerUrl('/tx/0x1')).toBe('https://etherscan.io/tx/0x1');
    expect(adapter.getExplorerUrl()).toBe('https://etherscan.io');
  });

  test('returns undefined when the chain has no block explorer', () => {
    expect(adapter.getExplorerUrl('/tx/0x1', noExplorerChain.id)).toBeUndefined();
    getConnection.mockReturnValue({ chain: undefined });
    expect(adapter.getExplorerUrl('/tx/0x1')).toBeUndefined();
  });
});

describe('pulsarEvmAdapter.getConnectorInfo', () => {
  // The name went in lower-cased, which no known name of Orbit's table matches, so Base Account was `evm:baseaccount`
  // on its transactions and `evm:coinbase` on its connection
  test.each([
    ['Base Account', 'evm:coinbase'],
    ['Trust Wallet', 'evm:trust'],
    ['Brave Wallet', 'evm:brave'],
    ['Safe', 'evm:safe'],
    ['Impersonated Connector', 'evm:impersonatedwallet'],
    ['MetaMask', 'evm:metamask'],
    ['Rabby Wallet', 'evm:rabbywallet'],
  ])('names %s as its connection does', (name, connectorType) => {
    getConnection.mockReturnValue({ address: '0x1', chain: mainnet, connector: { name } });
    expect(adapter.getConnectorInfo().connectorType).toBe(connectorType);
  });

  test('says unknown with no connector', () => {
    getConnection.mockReturnValue({ chain: mainnet });
    expect(adapter.getConnectorInfo().connectorType).toBe('evm:unknown');
  });
});

describe('pulsarEvmAdapter.retryTxAction', () => {
  // A Retry comes back with the action of the first call and nothing else of it: the next step of an app never ran, and
  // its session check was skipped
  test('keeps the callbacks and the check of the call it repeats, through the real store', async () => {
    const hash = `0x${'a'.repeat(64)}`;
    const startTracker = vi.fn().mockResolvedValue(undefined);
    const retrying: TxAdapter<EvmTransaction> = {
      ...pulsarEvmAdapter<EvmTransaction>({} as Config, [sepolia]),
      getConnectorInfo: () => ({ walletAddress: '0x1', connectorType: 'evm:metamask' }),
      checkChainForTx: vi.fn().mockResolvedValue(undefined),
      checkAndInitializeTrackerInStore: startTracker,
    };
    const saved = new Map<string, string>();
    const store = createPulsarStore<EvmTransaction>({
      name: 'evm-retry',
      adapter: retrying,
      storage: createJSONStorage(() => ({
        getItem: (key) => saved.get(key) ?? null,
        setItem: (key, value) => void saved.set(key, value),
        removeItem: (key) => void saved.delete(key),
      })),
    });
    const params = {
      adapter: OrbitAdapter.EVM,
      desiredChainID: sepolia.id,
      title: 'Swap',
      description: 'Swap tokens',
      type: 'SWAP',
    };
    const onSuccess = vi.fn();
    const beforeTxProcess = vi.fn();
    const action = vi.fn().mockRejectedValueOnce(new Error('rejected')).mockResolvedValueOnce(hash);

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
    const tx = store.getState().transactionsPool[hash];
    expect(tx).not.toHaveProperty('actionFunction');
    startTracker.mock.lastCall?.[0].onSuccess?.(tx);
    expect(onSuccess).toHaveBeenCalledWith(tx);
  });
});
