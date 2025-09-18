/**
 * @file This file contains the factory function for creating the Solana adapter for Pulsar.
 */

import { Transaction, TransactionAdapter, TransactionTracker, TxAdapter } from '@tuwaio/pulsar-core';
import { SolanaClusterMoniker } from 'gill';

import { SolanaChainMismatchError } from '../errors';
import { SolanaAdapterConfig } from '../types';
import { checkAndInitializeTrackerInStore } from '../utils/checkAndInitializeTrackerInStore';
import { checkSolanaChain } from '../utils/checkSolanaChain';
import { createSolanaRPC } from '../utils/createSolanaRPC';
import { getSolanaExplorerLink } from '../utils/getSolanaExplorerLink';
import { getSolanaAvatar, getSolanaName } from '../utils/snsUtils';

/**
 * Creates a Solana adapter for the Pulsar transaction tracking engine.
 * This factory function produces a wallet-library-agnostic adapter that can be
 * configured for multiple Solana clusters (e.g., mainnet-beta, devnet) and
 * can operate even without a connected wallet for read-only tasks.
 *
 * @template T - The application-specific transaction type.
 * @param {SolanaAdapterConfig} config - The configuration object for the adapter.
 * @returns {TxAdapter<T>} The configured Solana transaction adapter.
 *
 * @throws {Error} Throws an error if the wagmi `config` is not provided.
 */
export function solanaAdapter<T extends Transaction>(config: SolanaAdapterConfig): TxAdapter<T> {
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
      walletType: wallet?.walletType ?? 'unknown',
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
      tracker: TransactionTracker.Solana,
      txKey: actionTxKey as string,
    }),

    checkAndInitializeTrackerInStore: ({ tx, ...rest }) => {
      return checkAndInitializeTrackerInStore({
        tracker: tx.tracker,
        tx,
        ...rest,
      });
    },

    getExplorerUrl: (url) => {
      const cluster = wallet?.walletActiveChain ?? 'mainnet';
      return getSolanaExplorerLink(url, cluster);
    },

    getExplorerTxUrl: (tx) => {
      const cluster = getCluster(tx?.chainId as string);
      return getSolanaExplorerLink(`/tx/${tx.txKey}`, cluster);
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

    retryTxAction: async ({ onClose, txKey, handleTransaction, tx }) => {
      onClose(txKey);

      if (!wallet || !wallet.walletAddress || wallet.walletAddress === '0x0') {
        throw new Error('Retry failed: A wallet must be connected.');
      }
      if (!handleTransaction) {
        throw new Error('Retry failed: handleTransaction function is not provided.');
      }

      const clusterForRetry = getCluster(tx.desiredChainID as string);
      const rpcUrlForRetry = tx.rpcUrl ?? getRpcUrlForCluster(clusterForRetry);
      if (!rpcUrlForRetry) {
        throw new Error('Retry failed: Could not determine RPC endpoint for the transaction chain.');
      }

      const rpcForRetry = createSolanaRPC(rpcUrlForRetry);

      await handleTransaction({
        actionFunction: () =>
          tx.actionFunction({
            wallet: config.wallet,
            rpc: rpcForRetry,
            ...tx.payload,
          }),
        params: tx,
        defaultTracker: TransactionTracker.Solana,
      });
    },
  };
}
