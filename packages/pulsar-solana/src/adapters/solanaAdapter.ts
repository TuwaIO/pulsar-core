/**
 * @file This file contains the factory function for creating the Solana adapter for Pulsar.
 */

import { getWalletTypeFromConnectorName, lastConnectedWalletHelpers, OrbitAdapter } from '@tuwaio/orbit-core';
import {
  createSolanaClientWithCache,
  getAvailableWallets,
  getCluster,
  getConnectedSolanaWallet,
  getRpcUrlForCluster,
  getSolanaExplorerLink,
} from '@tuwaio/orbit-solana';
import { Transaction, TransactionTracker, TxAdapter } from '@tuwaio/pulsar-core';
import { SolanaClusterMoniker } from 'gill';

import { SolanaChainMismatchError } from '../errors';
import { SolanaAdapterConfig } from '../types';
import { checkAndInitializeTrackerInStore } from '../utils/checkAndInitializeTrackerInStore';
import { checkSolanaChain } from '../utils/checkSolanaChain';

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
export function pulsarSolanaAdapter<T extends Transaction>(config: SolanaAdapterConfig): TxAdapter<T> {
  const { rpcUrls } = config;

  return {
    key: OrbitAdapter.SOLANA,

    getWalletInfo: () => {
      const connectedWallet = getConnectedSolanaWallet();
      const localConnectedWallet = lastConnectedWalletHelpers.getLastConnectedWallet();
      return {
        walletAddress: localConnectedWallet?.address ?? connectedWallet.accounts[0].address ?? '0x0',
        walletType: getWalletTypeFromConnectorName(OrbitAdapter.SOLANA, connectedWallet.name),
      };
    },

    checkChainForTx: async (txChain) => {
      const connectedWallet = getConnectedSolanaWallet();
      if (!connectedWallet) {
        throw new Error('Wallet not provided. Cannot perform chain check.');
      }
      try {
        const lastConnectedWallet = lastConnectedWalletHelpers.getLastConnectedWallet();
        if (lastConnectedWallet) {
          lastConnectedWalletHelpers.setLastConnectedWallet({ ...lastConnectedWallet, chainId: txChain as string });
        }
        checkSolanaChain(
          txChain as string,
          (lastConnectedWalletHelpers.getLastConnectedWallet()?.chainId as string) ?? '',
        );
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

    getExplorerUrl: (url, chainId) => {
      return getSolanaExplorerLink(url, chainId);
    },
    getExplorerTxUrl: (tx) => {
      return getSolanaExplorerLink(`/tx/${tx.txKey}`, tx.chainId);
    },

    retryTxAction: async ({ onClose, txKey, executeTxAction, tx }) => {
      onClose(txKey);

      const wallets = getAvailableWallets();
      const connectedWallet = wallets.filter((wallet) => wallet.accounts.length > 0)[0];

      if (!connectedWallet || !connectedWallet.accounts[0].address || connectedWallet.accounts[0].address === '0x0') {
        throw new Error('Retry failed: A wallet must be connected.');
      }
      if (!executeTxAction) {
        throw new Error('Retry failed: handleTransaction function is not provided.');
      }

      const clusterForRetry = getCluster({ cluster: tx?.desiredChainID as string }) as SolanaClusterMoniker;
      const rpcUrlForRetry = tx.rpcUrl ?? getRpcUrlForCluster({ cluster: clusterForRetry, rpcUrls });

      if (!rpcUrlForRetry) {
        throw new Error('Retry failed: Could not determine RPC endpoint for the transaction chain.');
      }

      const client = createSolanaClientWithCache({ rpcUrlOrMoniker: rpcUrlForRetry, rpcUrls });

      await executeTxAction({
        actionFunction: () =>
          tx.actionFunction({
            client,
            ...tx.payload,
          }),
        params: tx,
        defaultTracker: TransactionTracker.Solana,
      });
    },
  };
}
