/**
 * @file This file contains the factory function for creating the EVM (Ethereum Virtual Machine) transaction adapter.
 * This adapter encapsulates all the logic required to interact with EVM-based chains using wagmi.
 */

import { Transaction, TransactionAdapter, TransactionTracker, TxAdapter } from '@tuwaio/pulsar-core';
import { Config, getAccount } from '@wagmi/core';
import { Chain, zeroAddress } from 'viem';

import { cancelTxAction } from '../utils/cancelTxAction';
import { checkAndInitializeTrackerInStore } from '../utils/checkAndInitializeTrackerInStore';
import { checkChainForTx } from '../utils/checkChainForTx';
import { checkTransactionsTracker } from '../utils/checkTransactionsTracker';
import { getAvatar, getName } from '../utils/ensUtils';
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
export function evmAdapter<T extends Transaction>(config: Config, appChains: Chain[]): TxAdapter<T> {
  if (!config) {
    throw new Error('EVM adapter requires a wagmi config object.');
  }

  return {
    key: TransactionAdapter.EVM,

    // --- Core Methods ---
    getWalletInfo: () => {
      const activeWallet = getAccount(config);
      return {
        walletAddress: activeWallet.address ?? zeroAddress,
        walletType: activeWallet.connector?.name?.toLowerCase() ?? 'unknown',
      };
    },
    checkChainForTx: (chainId: string | number) => checkChainForTx(chainId as number, config),
    checkTransactionsTracker: (actionTxKey, walletType) => checkTransactionsTracker(actionTxKey, walletType),
    checkAndInitializeTrackerInStore: ({ tx, ...rest }) =>
      checkAndInitializeTrackerInStore({ tracker: tx.tracker, tx, chains: appChains, ...rest }),

    // --- UI & Explorer Methods ---
    getExplorerUrl: (url) => {
      const { chain } = getAccount(config);
      const baseExplorerLink = chain?.blockExplorers?.default.url;
      return url ? `${baseExplorerLink}/${url}` : baseExplorerLink;
    },
    getExplorerTxUrl: (tx) =>
      selectEvmTxExplorerLink({
        chains: appChains,
        tx,
      }),
    getName: (address: string) => getName(address as `0x${string}`),
    getAvatar: (name: string) => getAvatar(name),

    // --- Optional Actions ---
    cancelTxAction: (tx) => cancelTxAction({ config, tx: tx as T }),
    speedUpTxAction: (tx) => speedUpTxAction({ config, tx: tx as T }),
    retryTxAction: async ({ onClose, txKey, handleTransaction, tx }) => {
      onClose(txKey);

      if (!handleTransaction) {
        console.error('Retry failed: handleTransaction function is not provided.');
        return;
      }

      await handleTransaction({
        actionFunction: () => tx.actionFunction({ config, ...tx.payload }),
        params: tx,
        defaultTracker: TransactionTracker.Ethereum,
      });
    },
  };
}
