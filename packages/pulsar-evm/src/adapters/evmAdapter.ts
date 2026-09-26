/**
 * @file The EVM adapter that plugs `@wagmi/core` and `viem` into the Pulsar store.
 */

import { getConnectorTypeFromName, lastConnectedConnectorHelpers, OrbitAdapter } from '@tuwaio/orbit-core';
import { checkAndSwitchChain } from '@tuwaio/orbit-evm';
import { Transaction, TransactionTracker, TxAdapter } from '@tuwaio/pulsar-core';
import { Config, getConnection } from '@wagmi/core';
import { Chain, zeroAddress } from 'viem';

import { cancelTxAction } from '../utils/cancelTxAction';
import { checkAndInitializeTrackerInStore } from '../utils/checkAndInitializeTrackerInStore';
import { checkTransactionsTracker } from '../utils/checkTransactionsTracker';
import { selectEvmTxExplorerLink } from '../utils/selectEvmTxExplorerLink';
import { speedUpTxAction } from '../utils/speedUpTxAction';

/**
 * Creates the EVM adapter for `createPulsarStore` from `@tuwaio/pulsar-core`. Pass it alone or in the adapter array.
 *
 * The adapter implements `TxAdapter` from `@tuwaio/pulsar-core`:
 * - `getConnectorInfo` returns the address of the active wagmi connection (or, without one, the last connected address
 *   saved in `localStorage` by `@tuwaio/orbit-core`, then the zero address) and the connector type, e.g. `evm:metamask`.
 * - `checkChainForTx` runs `checkAndSwitchChain` from `@tuwaio/orbit-evm`: when the wallet is on another chain, it asks
 *   the wallet to switch and rejects if the user declines.
 * - `checkTransactionsTracker` and `checkAndInitializeTrackerInStore` are {@link checkTransactionsTracker} and
 *   {@link checkAndInitializeTrackerInStore}.
 * - `getExplorerUrl(path, chainId)` appends a path to the default block explorer of `chainId` (looked up in
 *   `appChains`), or of the chain the wallet is connected to when `chainId` is omitted. It returns `undefined` when that
 *   chain has no block explorer. `getExplorerTxUrl` is {@link selectEvmTxExplorerLink} with `appChains`.
 * - `cancelTxAction` and `speedUpTxAction` are {@link cancelTxAction} and {@link speedUpTxAction}; both open a wallet
 *   prompt.
 * - `retryTxAction` closes the modal and runs `executeTxAction` again with
 *   `tx.actionFunction({ config, ...tx.payload })`; it logs an error and does nothing without `executeTxAction`.
 *
 * @template T - The application transaction type.
 * @param config - The wagmi config of the app.
 * @param appChains - The viem chains of the app, used to build explorer links.
 * @returns The EVM adapter.
 * @throws `Error` when `config` is not provided.
 *
 * @example
 * ```ts
 * import { createPulsarStore } from '@tuwaio/pulsar-core';
 * import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';
 * import { mainnet, sepolia } from 'viem/chains';
 *
 * const pulsarStore = createPulsarStore({
 *   name: 'transactions-tracking-storage',
 *   adapter: pulsarEvmAdapter(wagmiConfig, [mainnet, sepolia]),
 * });
 * ```
 */
export function pulsarEvmAdapter<T extends Transaction>(
  config: Config,
  appChains: readonly [Chain, ...Chain[]],
): TxAdapter<T> {
  if (!config) {
    throw new Error('EVM adapter requires a wagmi config object.');
  }

  return {
    key: OrbitAdapter.EVM,

    getConnectorInfo: () => {
      const activeConnection = getConnection(config);
      const localConnectedConnector = lastConnectedConnectorHelpers.getLastConnectedConnector();
      return {
        walletAddress: activeConnection.address ?? localConnectedConnector?.address ?? zeroAddress,
        connectorType: getConnectorTypeFromName(
          OrbitAdapter.EVM,
          activeConnection.connector?.name?.toLowerCase() ?? 'unknown',
        ),
      };
    },

    // --- Core Methods ---
    checkChainForTx: (chainId: string | number) => checkAndSwitchChain(chainId as number, config),
    checkTransactionsTracker: (props) => checkTransactionsTracker(props),
    checkAndInitializeTrackerInStore: ({ tx, ...rest }) =>
      checkAndInitializeTrackerInStore({ tracker: tx.tracker, tx, config, ...rest }),

    // --- UI & Explorer Methods ---
    getExplorerUrl: (url, chainId) => {
      const chain =
        chainId === undefined ? getConnection(config).chain : appChains.find((c) => c.id === Number(chainId));
      const baseExplorerLink = chain?.blockExplorers?.default.url;
      if (!baseExplorerLink) return undefined;
      return url ? `${baseExplorerLink.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}` : baseExplorerLink;
    },
    getExplorerTxUrl: (tx) =>
      selectEvmTxExplorerLink({
        chains: appChains,
        tx,
      }),

    // --- Optional Actions ---
    cancelTxAction: (tx) => cancelTxAction({ config, tx: tx as T }),
    speedUpTxAction: (tx) => speedUpTxAction({ config, tx: tx as T }),
    retryTxAction: async ({ onClose, txKey, executeTxAction, tx }) => {
      onClose(txKey);

      if (!executeTxAction) {
        console.error('Retry failed: executeTxAction function is not provided.');
        return;
      }

      await executeTxAction({
        actionFunction: () => tx.actionFunction({ config, ...tx.payload }),
        params: tx,
        defaultTracker: TransactionTracker.Ethereum,
      });
    },
  };
}
