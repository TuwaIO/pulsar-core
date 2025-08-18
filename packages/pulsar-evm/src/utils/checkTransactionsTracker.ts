/**
 * @file This file contains a utility function to determine the correct tracker for a transaction
 * based on the key returned by the submission function and the wallet type.
 */

import { isHex } from 'viem';

import { isGelatoTxKey } from '../trackers/gelatoTracker';
import { ActionTxKey, TransactionTracker } from '../types';

/**
 * Determines which transaction tracker to use based on the format of the transaction key and the wallet type.
 *
 * This function is a critical routing step after a transaction is submitted.
 * It follows a priority order:
 * 1. Checks for a Gelato Task ID.
 * 2. Checks if the wallet type is 'safe'.
 * 3. Defaults to a standard Ethereum tracker.
 *
 * @param {ActionTxKey} actionTxKey - The key returned from the transaction submission function (e.g., a hash or a Gelato task object).
 * @param {string} walletType - The type of the wallet that initiated the action (e.g., 'safe', 'metaMask').
 * @returns {{ tracker: TransactionTracker; txKey: string }} An object containing the determined tracker type and the final string-based transaction key.
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

  // At this point, actionTxKey must be a Hex string (transaction hash or SafeTxHash).
  // We can add a check for robustness, although TypeScript should infer this.
  if (!isHex(actionTxKey)) {
    throw new Error('Invalid transaction key format. Expected a Hex string or GelatoTxKey object.');
  }

  // 2. Second priority: Check if the transaction came from a Safe wallet.
  if (walletType === 'safe') {
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
