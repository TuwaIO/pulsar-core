/**
 * @file Builds the explorer URL of an EVM transaction.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { EvmTransaction, Transaction, TransactionTracker } from '@tuwaio/pulsar-core';
import { Chain } from 'viem';

import { gnosisSafeLinksHelper } from './safeConstants';

/**
 * Builds the URL of a transaction page:
 * - Safe transactions link to the transaction in the Safe web app ({@link gnosisSafeLinksHelper}).
 * - Other transactions link to `<explorer>/tx/<hash>` on the default block explorer of the chain in `chains`, where
 *   `<hash>` is `replacedTxHash`, else `hash`, else `txKey`. Before an ERC-4337 UserOperation is bundled, this is the
 *   `userOpHash`, which block explorers do not know. An EIP-5792 call batch has no link until the transaction that
 *   executed it is known: its batch ID is no transaction.
 *
 * @template T - The application transaction type.
 * @param params - The chains and the transaction.
 * @param params.chains - The viem chains of the app.
 * @param params.tx - The transaction.
 * @returns The URL, or an empty string when the chain or its explorer is not configured.
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

  // A batch ID is no transaction: link once the executing transaction is known
  if (tx.tracker === TransactionTracker.EIP5792 && !(tx as unknown as EvmTransaction).hash) return '';

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
