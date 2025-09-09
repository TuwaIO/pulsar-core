/**
 * @file This file defines types and enums specific to the EVM (Ethereum Virtual Machine) adapter.
 * It includes identifiers for different tracking strategies and the shape of transaction keys
 * used within the EVM ecosystem.
 */

import { Hex } from 'viem';

import { GelatoTxKey } from './trackers/gelatoTracker';

/**
 * Enum representing the different tracking strategies available for EVM transactions.
 * Each tracker corresponds to a specific method of monitoring a transaction's lifecycle.
 */
export enum TransactionTracker {
  /** For standard on-chain EVM transactions tracked by their hash. */
  Ethereum = 'ethereum',
  /** For multi-signature transactions managed and executed via a Safe contract. */
  Safe = 'safe',
  /** For meta-transactions relayed and executed by the Gelato Network. */
  Gelato = 'gelato',
}

/**
 * A union type representing the unique identifier returned by an `actionFunction`
 * after a transaction is submitted to the network or a relay service.
 *
 * This key is crucial for the EVM adapter to determine which tracker should
 * monitor the transaction.
 *
 * It can be one of the following:
 * - A standard `0x...` transaction hash (`Hex`).
 * - A structured object from a relay service like Gelato (`GelatoTxKey`).
 */
export type ActionTxKey = Hex | GelatoTxKey;
