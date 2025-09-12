/**
 * @file This file contains the factory function for creating the Solana adapter for Pulsar.
 */
import type { Transaction, TxAdapter } from '@tuwaio/pulsar-core';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { getExplorerLink, SolanaClusterMoniker } from 'gill';

import { SolanaChainMismatchError } from '../errors';
import { SolanaActionTxKey, SolanaAdapterConfig, SolanaTransactionTracker } from '../types';
import { checkAndInitializeTrackerInStore } from '../utils/checkAndInitializeTrackerInStore';
import { checkSolanaChain } from '../utils/checkSolanaChain';
import { createSolanaRPC } from '../utils/createSolanaRPC';
import { selectSolanaTxExplorerLink } from '../utils/selectSolanaTxExplorerLink';
import { getSolanaAvatar, getSolanaName } from '../utils/snsUtils';

/**
 * Creates a Solana adapter for the Pulsar transaction tracking engine.
 * This factory function produces a wallet-library-agnostic adapter that can be
 * configured for multiple Solana clusters (e.g., mainnet-beta, devnet) and
 * can operate even without a connected wallet for read-only tasks.
 *
 * @param config The configuration object for the adapter.
 * @returns An object implementing the `TxAdapter` interface for Solana.
 */
export function solanaAdapter<T extends Transaction<SolanaTransactionTracker>>(
  config: SolanaAdapterConfig,
): TxAdapter<SolanaTransactionTracker, T, SolanaActionTxKey> {
  const { wallet, rpcUrls } = config;

  /**
   * Safely extracts the cluster moniker from a chain identifier.
   * Handles both full chain IDs ('solana:mainnet-beta') and simple monikers ('mainnet-beta').
   * @param chain The chain identifier or moniker.
   * @returns The extracted cluster moniker.
   */
  const getCluster = (chain?: string): SolanaClusterMoniker => {
    const defaultCluster: SolanaClusterMoniker = 'mainnet';
    if (!chain) {
      return wallet?.walletActiveChain ?? defaultCluster;
    }
    return (chain.includes(':') ? chain.split(':')[1] : chain) as SolanaClusterMoniker;
  };

  /**
   * Retrieves the configured RPC URL for a given cluster moniker.
   * @param cluster The target cluster. Defaults to the wallet's active chain.
   * @returns The RPC URL or undefined if not found.
   */
  const getRpcUrlForCluster = (cluster?: SolanaClusterMoniker): string | undefined => {
    const targetCluster = cluster ?? wallet?.walletActiveChain;
    if (!targetCluster) return undefined;
    return rpcUrls[targetCluster];
  };

  return {
    key: TransactionAdapter.SOLANA,

    getWalletInfo: () => ({
      walletAddress: wallet?.walletAddress ?? '0x0',
      walletType: wallet?.walletType ?? 'disconnected',
    }),

    checkChainForTx: async (txChain) => {
      if (!wallet) {
        throw new Error('Wallet not provided. Cannot perform chain check.');
      }
      try {
        checkSolanaChain(txChain as string, wallet.walletActiveChain);
      } catch (e) {
        if (e instanceof SolanaChainMismatchError) throw e;
        throw new Error(`Chain check failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    },

    checkTransactionsTracker: (actionTxKey) => ({
      tracker: SolanaTransactionTracker.Solana,
      txKey: actionTxKey,
    }),

    checkAndInitializeTrackerInStore: ({ tx, ...rest }) => {
      return checkAndInitializeTrackerInStore({
        tracker: tx.tracker,
        tx,
        ...rest,
      });
    },

    getExplorerUrl: () => {
      const cluster = wallet?.walletActiveChain ?? 'mainnet-beta';
      return getExplorerLink({ cluster });
    },

    getExplorerTxUrl: (txPool, txKey) => {
      const tx = txPool[txKey];
      const cluster = getCluster(tx?.chainId as string);
      return selectSolanaTxExplorerLink(txKey, cluster);
    },

    getName: async (address) => {
      const rpcUrl = getRpcUrlForCluster(wallet?.walletActiveChain);
      if (!rpcUrl) {
        console.warn('Cannot get name: RPC URL for the current chain is not configured.');
        return null;
      }
      return getSolanaName(rpcUrl, address);
    },

    getAvatar: async (name) => {
      const rpcUrl = getRpcUrlForCluster(wallet?.walletActiveChain);
      if (!rpcUrl) {
        console.warn('Cannot get avatar: RPC URL for the current chain is not configured.');
        return null;
      }
      return getSolanaAvatar(rpcUrl, name);
    },

    retryTxAction: async ({ actions, onClose, txKey, handleTransaction, tx }) => {
      onClose(txKey);

      if (!wallet || !wallet.walletAddress || wallet.walletAddress === '0x0') {
        throw new Error('Retry failed: A wallet must be connected.');
      }
      if (!handleTransaction) {
        throw new Error('Retry failed: handleTransaction function is not provided.');
      }

      const actionKey = tx.actionKey;
      if (!actionKey || !actions?.[actionKey]) {
        throw new Error(`Retry failed: No action found for actionKey "${actionKey}".`);
      }

      const clusterForRetry = getCluster(tx.desiredChainID as string);
      const rpcUrlForRetry = tx.rpcUrl ?? getRpcUrlForCluster(clusterForRetry);
      if (!rpcUrlForRetry) {
        throw new Error('Retry failed: Could not determine RPC endpoint for the transaction chain.');
      }

      const retryAction = actions[actionKey];
      const rpcForRetry = createSolanaRPC(rpcUrlForRetry);

      const actionFunction = () =>
        (retryAction as any)({
          wallet: config.wallet,
          rpc: rpcForRetry,
          ...tx.payload,
        });

      await handleTransaction({
        actionFunction,
        params: tx,
        defaultTracker: SolanaTransactionTracker.Solana,
      });
    },
  };
}
