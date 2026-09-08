/**
 * @file This file contains a selector utility for generating a block explorer URL for a given EVM transaction.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { EvmTransaction, Transaction, TransactionTracker } from '@tuwaio/pulsar-core';
import { Chain } from 'viem';

import { gnosisSafeLinksHelper } from './safeConstants';

/**
 * Generates a URL to a block explorer or Safe UI for a given transaction.
 * It handles different URL structures for standard EVM transactions, Safe multi-sig, and ERC-4337 UserOperations.
 * Both standard transactions and ERC-4337 UserOperations link to the native block explorer (e.g., Etherscan).
 *
 * @template T - The transaction type, extending the base `Transaction`.
 *
 * @param {object} params - The parameters for the selection.
 * @param {Chain[]} params.chains - An array of supported chain objects, typically from `viem/chains`.
 * @param {T} params.tx - The transaction object for which to generate the link.
 *
 * @returns {string} The full URL to the transaction on the corresponding block explorer or Safe app,
 * or an empty string if the transaction or required chain configuration is not found.
 */
export const selectEvmTxExplorerLink = <T extends Transaction>({
  chains,
  tx,
}: {
  chains: readonly [Chain, ...Chain[]];
  tx: T;
}): string => {
  // Handle Safe transactions, which link to the Safe web app instead of a block explorer.
  if (tx.tracker === TransactionTracker.Safe) {
    const safeBaseUrl = gnosisSafeLinksHelper[tx.chainId as number];
    if (!safeBaseUrl) return '';

    return `${safeBaseUrl}${tx.from}/transactions/tx?id=multisig_${tx.from}_${tx.txKey}`;
  }

  // Handle standard EVM transactions and ERC-4337 UserOperations.
  const chain = chains.find((c) => c.id === tx.chainId);
  const explorerUrl = chain?.blockExplorers?.default.url;

  if (!explorerUrl) {
    // Return empty string if the chain or its explorer URL is not configured.
    return '';
  }

  // Determine the correct hash to display:
  // 1. Replaced transaction hash (for speed-up / cancel)
  // 2. Mined on-chain transaction hash
  // 3. Preliminary txKey (standard hash or UserOperation hash)
  const isEvm = tx.adapter === OrbitAdapter.EVM;
  const evmTx = isEvm ? (tx as unknown as EvmTransaction) : undefined;

  const hash = evmTx?.replacedTxHash || evmTx?.hash || tx.txKey;

  if (!hash) return '';

  return `${explorerUrl}/tx/${hash}`;
};
