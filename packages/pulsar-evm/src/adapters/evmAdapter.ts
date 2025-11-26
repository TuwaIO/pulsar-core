/**
 * @file This file contains the factory function for creating the EVM (Ethereum Virtual Machine) transaction adapter.
 * This adapter encapsulates all the logic required to interact with EVM-based chains using wagmi.
 */

import { getWalletTypeFromConnectorName, lastConnectedWalletHelpers, OrbitAdapter } from '@tuwaio/orbit-core';
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
 * Creates an EVM-specific transaction adapter.
 *
 * This function acts as a constructor for the EVM adapter, bundling all the necessary
 * chain-specific utilities (like checking chain, ENS resolution, speeding up transactions, etc.)
 * into a single object that conforms to the `TxAdapter` interface.
 *
 * @template T - The application-specific transaction type.
 * @param {Config} config - The wagmi configuration object.
 * @param {Chain[]} appChains - An array of viem `Chain` objects supported by the application.
 *
 * @returns {TxAdapter<T>} The configured EVM transaction adapter.
 *
 * @throws {Error} Throws an error if the wagmi `config` is not provided.
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

    getWalletInfo: () => {
      const activeWallet = getConnection(config);
      const localConnectedWallet = lastConnectedWalletHelpers.getLastConnectedWallet();
      return {
        walletAddress: activeWallet.address ?? localConnectedWallet?.address ?? zeroAddress,
        walletType: getWalletTypeFromConnectorName(
          OrbitAdapter.EVM,
          activeWallet.connector?.name?.toLowerCase() ?? 'unknown',
        ),
      };
    },

    // --- Core Methods ---
    checkChainForTx: (chainId: string | number) => checkAndSwitchChain(chainId as number, config),
    checkTransactionsTracker: (actionTxKey, walletType) => checkTransactionsTracker(actionTxKey, walletType),
    checkAndInitializeTrackerInStore: ({ tx, ...rest }) =>
      checkAndInitializeTrackerInStore({ tracker: tx.tracker, tx, config, ...rest }),

    // --- UI & Explorer Methods ---
    getExplorerUrl: (url) => {
      const { chain } = getConnection(config);
      const baseExplorerLink = chain?.blockExplorers?.default.url;
      return url ? `${baseExplorerLink}/${url}` : baseExplorerLink;
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
