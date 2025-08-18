/**
 * @file This file defines types and enums specific to the EVM transaction tracking package.
 * It includes identifiers for different tracking strategies and the shape of transaction keys.
 */

import { Hex } from 'viem';

import { GelatoTxKey } from './trackers/gelatoTracker';

/**
 * Enum representing the different tracking strategies available for EVM transactions.
 */
export enum TransactionTracker {
  /** For standard on-chain EVM transactions tracked by their hash. */
  Ethereum = 'ethereum',
  /** For multi-signature transactions managed by a Safe contract. */
  Safe = 'safe',
  /** For meta-transactions relayed through the Gelato Network. */
  Gelato = 'gelato',
}

/**
 * Represents the unique identifier returned by an action function after a transaction is submitted.
 * This key is used to determine which tracker should monitor the transaction.
 * It can be a standard transaction hash or a structured key from a relay service like Gelato.
 * @typedef {Hex | GelatoTxKey} ActionTxKey
 */
export type ActionTxKey = Hex | GelatoTxKey;
