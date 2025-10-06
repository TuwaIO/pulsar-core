/**
 * @file This file contains a utility function to determine the correct tracker for a transaction
 * based on the key returned by the submission function and the wallet type.
 */

import { ActionTxKey, TransactionTracker } from '@tuwaio/pulsar-core';
import { isHex } from 'viem';

import { isGelatoTxKey } from '../trackers/gelatoTracker';

/**
 * Determines which transaction tracker to use based on the format of the transaction key and the wallet type.
 *
 * This function is a critical routing step after a transaction is submitted. It inspects
 * the key returned by the `actionFunction` and the wallet type to decide the tracking strategy.
 * The logic follows a specific priority:
 * 1. Checks for a Gelato Task ID structure.
 * 2. Checks if the wallet type indicates a Safe transaction.
 * 3. Defaults to the standard on-chain EVM hash tracker.
 *
 * @param {ActionTxKey} actionTxKey - The key returned from the transaction submission function (e.g., a hash or a Gelato task object).
 * @param {string} walletType - The type of the wallet that initiated the action (e.g., 'safe', 'injected').
 *
 * @returns {{ tracker: TransactionTracker; txKey: string }} An object containing the determined tracker type and the final string-based transaction key.
 *
 * @throws {Error} Throws an error if the `actionTxKey` is not a valid Hex string after failing the Gelato check.
 */
export function checkTransactionsTracker(
  actionTxKey: ActionTxKey,
  walletType: string,
): { tracker: TransactionTracker; txKey: string } {
  // 1. Highest priority: Check if the key matches the Gelato task structure.
  if (isGelatoTxKey(actionTxKey)) {
    return {
      tracker: TransactionTracker.Gelato,
      txKey: actionTxKey.taskId,
    };
  }

  // At this point, actionTxKey must be a Hex string (e.g., a transaction hash or SafeTxHash).
  // This check adds robustness in case of type mismatches.
  if (!isHex(actionTxKey)) {
    throw new Error(
      `Invalid transaction key format. Expected a Hex string or a GelatoTxKey object, but received: ${JSON.stringify(
        actionTxKey,
      )}`,
    );
  }

  // 2. Second priority: Check if the transaction came from a Safe wallet.
  // The check is case-insensitive for robustness.
  const splittingWalletType = walletType.split(':');
  if (
    splittingWalletType.length > 1
      ? splittingWalletType[splittingWalletType.length - 1] === 'safe'
      : walletType?.toLowerCase() === 'safe'
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
