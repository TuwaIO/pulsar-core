/**
 * @file This file contains the factory function for creating the Solana adapter for Pulsar.
 */

import { createSolanaRpc } from '@solana/kit';
import { Transaction, TransactionAdapter, TransactionPool, TxAdapter } from '@tuwaio/pulsar-core';

import { SolanaActionTxKey, SolanaAdapterConfig, SolanaCluster, SolanaTransactionTracker } from '../types';
import { checkAndInitializeTrackerInStore } from '../utils/checkAndInitializeTrackerInStore';
import { checkSolanaChain } from '../utils/checkSolanaChain';
import { selectSolanaTxExplorerLink } from '../utils/selectSolanaTxExplorerLink';
import { getSolanaAvatar, getSolanaName } from '../utils/snsUtils';

/**
 * Factory function to create a Solana adapter for Pulsar.
 * This adapter provides all the necessary logic to interact with the Solana ecosystem,
 * including wallet interactions, transaction tracking, and name services.
 *
 * @param {SolanaAdapterConfig} config - The configuration object, typically derived from Solana wallet adapter hooks.
 * @returns {TxAdapter} An object conforming to the `TxAdapter` interface.
 */
export function solanaAdapter<T extends Transaction<SolanaTransactionTracker>>(
  config: SolanaAdapterConfig,
): TxAdapter<SolanaTransactionTracker, T, SolanaActionTxKey> {
  const { wallet, connection, explorerUrl, cluster } = config;

  return {
    key: TransactionAdapter.SOLANA,

    // --- Core Methods ---
    getWalletInfo: () => ({
      walletAddress: wallet?.publicKey?.toBase58() ?? '0x0',
      walletType: wallet?.wallet?.adapter.name.toLowerCase() ?? 'unknown',
    }),

    checkChainForTx: async (txCluster) => {
      // Use the rpcEndpoint from the main connection context for pre-flight checks.
      const currentRpcUrl = connection?.connection.rpcEndpoint;
      if (!currentRpcUrl) {
        // This can happen if the adapter is used in a read-only mode without a provider.
        // We warn but do not throw, allowing tracking to continue if the rpcUrl is in the tx.
        console.warn('Cannot check chain: connection context not provided to adapter.');
        return;
      }
      await checkSolanaChain(currentRpcUrl, txCluster as SolanaCluster);
    },

    checkTransactionsTracker: (actionTxKey) => {
      // For Solana, the actionTxKey is always the transaction signature.
      return { tracker: SolanaTransactionTracker.Solana, txKey: actionTxKey };
    },

    checkAndInitializeTrackerInStore: ({ tx, ...rest }) => {
      // Delegate to the tracker router utility.
      return checkAndInitializeTrackerInStore({
        tracker: tx.tracker,
        tx,
        ...rest,
      });
    },

    // --- UI & Explorer Methods ---
    getExplorerUrl: () => {
      return explorerUrl ?? 'https://solscan.io';
    },

    getExplorerTxUrl: (txPool: TransactionPool<any, any>, txKey: string) => {
      const baseUrl = explorerUrl ?? 'https://solscan.io';
      return selectSolanaTxExplorerLink(baseUrl, txKey, cluster);
    },

    // --- Optional Name Service Methods ---
    getName: async (address: string) => {
      if (!connection) {
        console.warn('Cannot get name: connection context not provided to adapter.');
        return null;
      }
      return getSolanaName(connection, address);
    },

    getAvatar: async (name: string) => {
      if (!connection) {
        console.warn('Cannot get avatar: connection context not provided to adapter.');
        return null;
      }
      return getSolanaAvatar(connection, name);
    },

    // --- Optional Actions ---
    retryTxAction: async ({ actions, onClose, txKey, handleTransaction, tx }) => {
      onClose(txKey);

      if (!wallet) {
        throw new Error('Retry failed: A wallet must be connected to retry a transaction.');
      }
      if (!handleTransaction) {
        throw new Error('Retry failed: handleTransaction function is not provided.');
      }

      const actionKey = tx.actionKey;
      if (!actionKey || !actions?.[actionKey]) {
        throw new Error(`Retry failed: No action found for actionKey "${actionKey}".`);
      }

      const retryAction = actions[actionKey];

      // Prioritize the RPC URL from the original transaction, falling back to the current connection.
      const rpcUrlForRetry = tx.rpcUrl ?? connection?.connection.rpcEndpoint;
      if (!rpcUrlForRetry) {
        throw new Error('Retry failed: Could not determine RPC endpoint.');
      }

      const rpcForRetry = createSolanaRpc(rpcUrlForRetry);

      await handleTransaction({
        actionFunction: () =>
          (retryAction as any)({
            wallet,
            connection: connection?.connection,
            rpc: rpcForRetry,
            ...tx.payload,
          }),
        params: tx,
        defaultTracker: SolanaTransactionTracker.Solana,
      });
    },
  };
}
