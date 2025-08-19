import { ITxTrackingStore, Transaction, TransactionAdapter, TxAdapter } from '@tuwaio/pulsar-core';
import { Config, getAccount } from '@wagmi/core';
import { Chain, zeroAddress } from 'viem';

import { ActionTxKey, TransactionTracker } from '../types';
import { checkAndInitializeTrackerInStore } from '../utils/checkAndInitializeTrackerInStore';
import { checkChainForTx } from '../utils/checkChainForTx';
import { checkTransactionsTracker } from '../utils/checkTransactionsTracker';

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
    };
  } else {
    throw new Error('EVM adapter requires a Wagmi config object.');
  }
}
