/**
 * @file This file contains the factory function for creating the Solana adapter for Pulsar.
 */

import { connectedWalletChainHelpers, getWalletTypeFromConnectorName, OrbitAdapter } from '@tuwaio/orbit-core';
import { createSolanaRPC, getCluster, getRpcUrlForCluster, getSolanaExplorerLink } from '@tuwaio/orbit-solana';
import { Transaction, TransactionTracker, TxAdapter } from '@tuwaio/pulsar-core';
import { getWallets } from '@wallet-standard/app';
import { getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as getOrCreateUiWalletForStandardWallet } from '@wallet-standard/ui-registry';
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

  /**
   * Helper to get all available wallets
   */
  const getAvailableWallets = () => getWallets().get().map(getOrCreateUiWalletForStandardWallet);

  return {
    key: OrbitAdapter.SOLANA,

    getWalletInfo: () => {
      const wallets = getAvailableWallets();
      const connectedWallet = wallets.filter((wallet) => wallet.accounts.length > 0)[0];
      return {
        walletAddress: connectedWallet.accounts[0].address ?? '0x0',
        walletType: getWalletTypeFromConnectorName(OrbitAdapter.SOLANA, connectedWallet.name),
      };
    },

    checkChainForTx: async (txChain) => {
      const wallets = getAvailableWallets();
      const connectedWallet = wallets.filter((wallet) => wallet.accounts.length > 0)[0];
      if (!connectedWallet) {
        throw new Error('Wallet not provided. Cannot perform chain check.');
      }
      try {
        checkSolanaChain(txChain as string, connectedWalletChainHelpers.getConnectedWalletChain() ?? '');
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
      const cluster = getCluster({ cluster: chainId as string }) ?? 'mainnet';
      return getSolanaExplorerLink(url, cluster as SolanaClusterMoniker);
    },

    getExplorerTxUrl: (tx) => {
      const cluster = getCluster({ cluster: tx?.chainId as string }) as SolanaClusterMoniker;
      return getSolanaExplorerLink(`/tx/${tx.txKey}`, cluster);
    },
    // TODO: remove after styling wallet connect flow
    getName: async (address) => {
      const wallets = getAvailableWallets();
      const connectedWallet = wallets.filter((wallet) =>
        wallet.accounts.some((account) => account.address.toLowerCase() === address.toLowerCase()),
      )[0];
      return connectedWallet?.accounts[0]?.label ?? address;
    },
    // TODO: remove after styling wallet connect flow
    getAvatar: async (name) => {
      const wallets = getAvailableWallets();
      const connectedWallet = wallets.filter((wallet) =>
        wallet.accounts.some((account) => account.label?.toLowerCase() === name.toLowerCase()),
      )[0];
      return connectedWallet?.accounts[0]?.icon ?? name;
    },

    retryTxAction: async ({ onClose, txKey, handleTransaction, tx }) => {
      onClose(txKey);

      const wallets = getAvailableWallets();
      const connectedWallet = wallets.filter((wallet) => wallet.accounts.length > 0)[0];

      if (!connectedWallet || !connectedWallet.accounts[0].address || connectedWallet.accounts[0].address === '0x0') {
        throw new Error('Retry failed: A wallet must be connected.');
      }
      if (!handleTransaction) {
        throw new Error('Retry failed: handleTransaction function is not provided.');
      }

      const clusterForRetry = getCluster({ cluster: tx?.desiredChainID as string }) as SolanaClusterMoniker;
      const rpcUrlForRetry = tx.rpcUrl ?? getRpcUrlForCluster({ cluster: clusterForRetry, rpcUrls });

      if (!rpcUrlForRetry) {
        throw new Error('Retry failed: Could not determine RPC endpoint for the transaction chain.');
      }

      const rpcForRetry = createSolanaRPC(rpcUrlForRetry);

      await handleTransaction({
        actionFunction: () =>
          tx.actionFunction({
            wallet: {
              walletAddress: connectedWallet.accounts[0].address ?? '0x0',
              walletType: getWalletTypeFromConnectorName(OrbitAdapter.SOLANA, connectedWallet.name),
            },
            rpc: rpcForRetry,
            ...tx.payload,
          }),
        params: tx,
        defaultTracker: TransactionTracker.Solana,
      });
    },
  };
}
