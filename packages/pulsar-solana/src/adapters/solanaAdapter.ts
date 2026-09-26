/**
 * @file The Solana adapter that plugs Wallet Standard wallets and `@solana/kit` into the Pulsar store.
 */

import { getConnectorTypeFromName, lastConnectedConnectorHelpers, OrbitAdapter } from '@tuwaio/orbit-core';
import {
  createSolanaClientWithCache,
  getAvailableSolanaConnectors,
  getCluster,
  getConnectedSolanaConnector,
  getRpcUrlForCluster,
  getSolanaExplorerLink,
  type SolanaClusterMoniker,
} from '@tuwaio/orbit-solana';
import { Transaction, TransactionTracker, TxAdapter } from '@tuwaio/pulsar-core';

import { SolanaChainMismatchError } from '../errors';
import { SolanaAdapterConfig } from '../types';
import { checkAndInitializeTrackerInStore } from '../utils/checkAndInitializeTrackerInStore';
import { checkSolanaChain } from '../utils/checkSolanaChain';

/**
 * Removes the `solana:` prefix of a chain ID, so `solana:devnet` and `devnet` compare as the same cluster.
 *
 * @param chainId - A cluster moniker or a `solana:` chain ID.
 * @returns The cluster moniker.
 */
const toClusterMoniker = (chainId: string) =>
  chainId.startsWith('solana:') ? chainId.slice('solana:'.length) : chainId;

/**
 * Creates the Solana adapter for `createPulsarStore` from `@tuwaio/pulsar-core`. Pass it alone or in the adapter array.
 *
 * The adapter reads the connected wallet from the last connection saved in `localStorage` by `@tuwaio/orbit-core`
 * (Satellite Connect writes it) and finds the matching Wallet Standard wallet with `getConnectedSolanaConnector` from
 * `@tuwaio/orbit-solana`. It implements `TxAdapter` from `@tuwaio/pulsar-core`:
 * - `getConnectorInfo` returns the saved address and the connector type, e.g. `solana:phantom`. It throws when no
 *   installed wallet holds the saved address.
 * - `checkChainForTx` compares `desiredChainID` with the saved chain of the connection, ignoring a `solana:` prefix
 *   (`devnet` and `solana:devnet` are the same cluster), and throws {@link SolanaChainMismatchError} when they differ.
 *   It does not switch the wallet.
 * - `checkTransactionsTracker` keeps the returned signature as `txKey` and uses `TransactionTracker.Solana` unless
 *   another tracker is requested.
 * - `checkAndInitializeTrackerInStore` is {@link checkAndInitializeTrackerInStore}.
 * - `getExplorerUrl` and `getExplorerTxUrl` build Solana Explorer links with `getSolanaExplorerLink` from
 *   `@tuwaio/orbit-solana`.
 * - `retryTxAction` closes the modal and runs `executeTxAction` again with `tx.actionFunction({ client, ...tx.payload })`,
 *   where `client` is a cached RPC client for `tx.rpcUrl` or the cluster of `desiredChainID`. It throws when no wallet
 *   is connected or `executeTxAction` is missing.
 *
 * There is no `cancelTxAction` or `speedUpTxAction` for Solana.
 *
 * @template T - The application transaction type.
 * @param config - The RPC URLs by cluster.
 * @returns The Solana adapter.
 *
 * @example
 * ```ts
 * import { createPulsarStore } from '@tuwaio/pulsar-core';
 * import { pulsarSolanaAdapter } from '@tuwaio/pulsar-solana';
 *
 * const pulsarStore = createPulsarStore({
 *   name: 'transactions-tracking-storage',
 *   adapter: pulsarSolanaAdapter({ rpcUrls: { devnet: 'https://api.devnet.solana.com' } }),
 * });
 * ```
 */
export function pulsarSolanaAdapter<T extends Transaction>(config: SolanaAdapterConfig): TxAdapter<T> {
  const { rpcUrls } = config;

  return {
    key: OrbitAdapter.SOLANA,

    getConnectorInfo: () => {
      const connectedConnector = getConnectedSolanaConnector();
      const localConnectedConnector = lastConnectedConnectorHelpers.getLastConnectedConnector();
      return {
        walletAddress: localConnectedConnector?.address ?? connectedConnector.accounts[0].address ?? '0x0',
        connectorType: getConnectorTypeFromName(OrbitAdapter.SOLANA, connectedConnector.name),
      };
    },

    checkChainForTx: async (txChain) => {
      const connectedConnector = getConnectedSolanaConnector();
      if (!connectedConnector) {
        throw new Error('Wallet not provided. Cannot perform chain check.');
      }
      try {
        checkSolanaChain(
          toClusterMoniker(String(txChain)),
          toClusterMoniker(String(lastConnectedConnectorHelpers.getLastConnectedConnector()?.chainId ?? '')),
        );
      } catch (e) {
        if (e instanceof SolanaChainMismatchError) throw e;
        throw new Error(`Chain check failed: ${e instanceof Error ? e.message : String(e)}`, { cause: e });
      }
    },

    checkTransactionsTracker: ({ actionTxKey, tracker }) => ({
      tracker: tracker ?? TransactionTracker.Solana,
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

      const connectors = getAvailableSolanaConnectors();
      const connectedConnector = connectors.filter((connector) => connector.accounts.length > 0)[0];

      if (
        !connectedConnector ||
        !connectedConnector.accounts[0].address ||
        connectedConnector.accounts[0].address === '0x0'
      ) {
        throw new Error('Retry failed: A wallet must be connected.');
      }
      if (!executeTxAction) {
        throw new Error('Retry failed: executeTxAction function is not provided.');
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
