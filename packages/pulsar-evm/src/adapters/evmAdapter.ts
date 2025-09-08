import { ITxTrackingStore, Transaction, TransactionAdapter, TxAdapter } from '@tuwaio/pulsar-core';
import { Config, getAccount } from '@wagmi/core';
import { Chain, zeroAddress } from 'viem';

import { ActionTxKey, TransactionTracker } from '../types';
import { cancelTxAction } from '../utils/cancelTxAction';
import { checkAndInitializeTrackerInStore } from '../utils/checkAndInitializeTrackerInStore';
import { checkChainForTx } from '../utils/checkChainForTx';
import { checkTransactionsTracker } from '../utils/checkTransactionsTracker';
import { selectEvmTxExplorerLink } from '../utils/selectEvmTxExplorerLink';
import { speedUpTxAction } from '../utils/speedUpTxAction';

/**
 * Creates an EVM-specific transaction adapter that provides utilities to manage transactions and interact with chains.
 *
 * @param {Config} config - The configuration object for the Wagmi library, required to initialize the adapter.
 * @param {Chain[]} appChains - An array of available chain configurations for the application.
 * @return {TxAdapter<TransactionTracker, T, ActionTxKey>} The EVM transaction adapter with methods to interact with chains and transactions.
 * @throws {Error} Throws an error when the configuration object is not provided.
 */
export function evmAdapter<T extends Transaction<TransactionTracker>>(
  config: Config,
  appChains: Chain[],
): TxAdapter<TransactionTracker, T, ActionTxKey> {
  if (config) {
    return {
      key: TransactionAdapter.EVM,
      getWalletInfo: () => {
        const activeWallet = getAccount(config);
        return {
          walletAddress: activeWallet.address ?? zeroAddress,
          walletType: activeWallet.connector?.type ?? '',
        };
      },
      checkChainForTx: (chainId: string | number) => checkChainForTx(chainId as number, config),
      checkTransactionsTracker: (actionTxKey: ActionTxKey, walletType: string) =>
        checkTransactionsTracker(actionTxKey, walletType),
      checkAndInitializeTrackerInStore: ({
        tx,
        ...rest
      }: { tx: T } & Pick<
        ITxTrackingStore<TransactionTracker, T, ActionTxKey>,
        'transactionsPool' | 'updateTxParams' | 'onSucceedCallbacks' | 'removeTxFromPool'
      >) => checkAndInitializeTrackerInStore({ tracker: tx.tracker, tx, chains: appChains, ...rest }),
      getExplorerUrl: () => {
        const activeWallet = getAccount(config);
        return activeWallet?.chain?.blockExplorers?.default.url;
      },
      cancelTxAction: (tx) => cancelTxAction({ config, tx }),
      speedUpTxAction: (tx) => speedUpTxAction({ config, tx }),
      retryTxAction: async ({ actions, onClose, txKey, handleTransaction, tx }) => {
        onClose(txKey);
        if (handleTransaction) {
          await handleTransaction({
            actionFunction: () =>
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              actions![tx?.actionKey]({
                config,
                ...tx.payload,
              }),
            params: tx,
            defaultTracker: TransactionTracker.Ethereum,
          });
        }
      },
      getExplorerTxUrl: (transactionsPool, txKey, replacedTxHash) =>
        selectEvmTxExplorerLink(transactionsPool, appChains, txKey as `0x${string}`, replacedTxHash as `0x${string}`),
    };
  } else {
    throw new Error('EVM adapter requires a Wagmi config object.');
  }
}
