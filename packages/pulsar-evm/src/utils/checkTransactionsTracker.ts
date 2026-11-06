/**
 * @file Picks the EVM tracker for the key returned by an `actionFunction`.
 */

import { CheckTxTracker, TransactionTracker } from '@tuwaio/pulsar-core';
import { isHex } from 'viem';

/**
 * Picks the tracker for the key returned by an `actionFunction`. The key is always used as `txKey`. Rules, in order:
 * 1. `tracker` is `EIP5792`: `EIP5792` (the key is the batch ID `wallet_sendCalls` returned, in any form). EIP-5792 is
 *    never detected automatically.
 * 2. The key must be a hex string; otherwise it throws.
 * 3. `tracker` is `ERC4337`: `ERC4337` (the key is a `userOpHash`). ERC-4337 is never detected automatically.
 * 4. The connector type ends with `safe` or `safewallet` (for example `evm:safe`): `Safe` (the key is a `safeTxHash`).
 * 5. Otherwise: `Ethereum`.
 *
 * `bundlerUrl` and `pimlicoApiKey` are not used here. `pulsarEvmAdapter` uses this function as
 * `checkTransactionsTracker`.
 *
 * @param params - The returned key and its context (`CheckTxTracker` from `@tuwaio/pulsar-core`).
 * @param params.actionTxKey - The key returned by `actionFunction`.
 * @param params.connectorType - The connector that signed the transaction.
 * @param params.tracker - The tracker requested in the transaction params, if any.
 * @returns The tracker and the `txKey`.
 * @throws `Error` when the key is not a hex string and the EIP-5792 rule does not apply.
 *
 * @example
 * ```ts
 * checkTransactionsTracker({ actionTxKey: '0xabc123', connectorType: 'evm:metamask' });
 * // { tracker: TransactionTracker.Ethereum, txKey: '0xabc123' }
 * ```
 */
export function checkTransactionsTracker({ actionTxKey, connectorType, tracker }: CheckTxTracker): {
  /** The tracker to use. */
  tracker: TransactionTracker;
  /** The key to store the transaction under: always `actionTxKey`. */
  txKey: string;
} {
  // An EIP-5792 batch ID is the wallet's own: it need not be hex
  if (tracker === TransactionTracker.EIP5792) {
    return {
      tracker: TransactionTracker.EIP5792,
      txKey: actionTxKey,
    };
  }

  // At this point, actionTxKey must be a Hex string (e.g., a transaction hash, userOpHash, or SafeTxHash).
  // This check adds robustness in case of type mismatches.
  if (!isHex(actionTxKey)) {
    throw new Error(
      `Invalid transaction key format. Expected a Hex string, but received: ${JSON.stringify(
        actionTxKey,
      )}`,
    );
  }

  // Check for native ERC-4337 UserOperation tracker.
  if (tracker && tracker === TransactionTracker.ERC4337) {
    return {
      tracker: TransactionTracker.ERC4337,
      txKey: actionTxKey,
    };
  }

  // 2. Second priority: Check if the transaction came from a Safe wallet.
  // The check is case-insensitive for robustness.
  const splittingConnectorType = connectorType.split(':');
  if (
    splittingConnectorType.length > 1
      ? splittingConnectorType[splittingConnectorType.length - 1] === 'safe' ||
        splittingConnectorType[splittingConnectorType.length - 1] === 'safewallet'
      : connectorType?.toLowerCase() === 'safe'
  ) {
    return {
      tracker: TransactionTracker.Safe,
      txKey: actionTxKey,
    };
  }

  // 3. Default: Treat as a standard on-chain Ethereum transaction.
  return {
    tracker: TransactionTracker.Ethereum,
    txKey: actionTxKey,
  };
}
