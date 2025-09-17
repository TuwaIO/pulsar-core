/**
 * @file This file contains a selector utility for generating a block explorer URL for a given EVM transaction.
 */

import {
  selectTxByKey,
  Transaction,
  TransactionAdapter,
  TransactionPool,
  TransactionTracker,
} from '@tuwaio/pulsar-core';
import { Chain, Hex } from 'viem';

import { gnosisSafeLinksHelper } from './safeConstants';

/**
 * Generates a URL to a block explorer or Safe UI for a given transaction.
 * It handles different URL structures for standard EVM transactions and Safe multi-sig transactions.
 *
 * @template T - The transaction type, extending the base `Transaction`.
 *
 * @param {object} params - The parameters for the selection.
 * @param {TransactionPool<T>} params.transactionsPool - The entire pool of transactions from the store.
 * @param {Chain[]} params.chains - An array of supported chain objects, typically from `viem/chains`.
 * @param {Hex} params.txKey - The unique key (`txKey`) of the transaction for which to generate the link.
 * @param {Hex} [params.replacedTxHash] - Optional. If this is a speed-up/cancel transaction, this is the hash of the new transaction.
 *
 * @returns {string} The full URL to the transaction on the corresponding block explorer or Safe app,
 * or an empty string if the transaction or required chain configuration is not found.
 */
export const selectEvmTxExplorerLink = <T extends Transaction>({
  transactionsPool,
  chains,
  txKey,
  replacedTxHash,
}: {
  transactionsPool: TransactionPool<T>;
  chains: Chain[];
  txKey: Hex;
  replacedTxHash?: Hex;
}): string => {
  const tx = selectTxByKey(transactionsPool, txKey);

  if (!tx) {
    return '';
  }

  // Handle Safe transactions, which link to the Safe web app instead of a block explorer.
  if (tx.tracker === TransactionTracker.Safe) {
    const safeBaseUrl = gnosisSafeLinksHelper[tx.chainId as number];
    if (!safeBaseUrl) return '';

    return `${safeBaseUrl}${tx.from}/transactions/tx?id=multisig_${tx.from}_${tx.txKey}`;
  }

  // Handle standard EVM transactions.
  const chain = chains.find((c) => c.id === tx.chainId);
  const explorerUrl = chain?.blockExplorers?.default.url;

  if (!explorerUrl) {
    // Return empty string if the chain or its explorer URL is not configured.
    return '';
  }

  // Determine the correct hash to display. Prioritize the replaced hash for speed-up/cancel transactions.
  const hash = replacedTxHash || (tx.adapter === TransactionAdapter.EVM ? tx.hash : tx.txKey);

  if (!hash) return '';

  return `${explorerUrl}/tx/${hash}`;
};
