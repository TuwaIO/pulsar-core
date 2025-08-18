/**
 * @file This file defines the core data structures and TypeScript types for the Pulsar transaction tracking engine.
 * It includes types for transactions, their statuses, store interfaces, and utility types for Zustand slices.
 * These types are framework-agnostic and form the foundation of the entire tracking system.
 */

import { StoreApi } from 'zustand';

import { IInitializeTxTrackingStore } from './store/initializeTxTrackingStore';

/**
 * A utility type for creating modular Zustand store slices.
 * @template T The state slice type.
 * @template E The full store state type, defaults to T.
 */
export type StoreSlice<T extends object, E extends object = T> = (
  set: StoreApi<E extends T ? E : E & T>['setState'],
  get: StoreApi<E extends T ? E : E & T>['getState'],
) => T;

/**
 * Represents the blockchain adapter for a transaction.
 */
export enum TransactionAdapter {
  /** EVM adapter. */
  EVM = 'evm',
  /** Solana adapter. */
  SOLANA = 'solana',
  /** Starknet adapter. */
  Starknet = 'Starknet',
}

/**
 * Represents the final status of a transaction.
 */
export enum TransactionStatus {
  /** The transaction failed to execute. */
  Failed = 'Failed',
  /** The transaction was successfully mined and executed. */
  Success = 'Success',
  /** The transaction was replaced by another (e.g., speed-up). */
  Replaced = 'Replaced',
}

/**
 * The base structure for any transaction being tracked.
 * @template T The type of the tracker identifier (e.g., 'evm', 'safe').
 */
export type BaseTransaction<T> = {
  /** A key identifying the retry logic for this transaction from the actions registry. */
  actionKey?: string;
  /** The chain identifier (e.g., 1 for Ethereum Mainnet, 'SN_MAIN' for Starknet). */
  chainId: number | string;
  /** A description for the transaction, with states for [pending, success, error, replaced]. */
  description?: string | [string, string, string, string];
  /** An error message if the transaction failed. */
  errorMessage?: string;
  /** The timestamp (in seconds) when the transaction was finalized on-chain. */
  finishedTimestamp?: number;
  /** The sender's address. */
  from: string;
  /** A flag indicating if the transaction is in a failed state. */
  isError?: boolean;
  /** A flag indicating if the detailed tracking modal should be open for this transaction. For UI purposes. */
  isTrackedModalOpen?: boolean;
  /** The local timestamp (in seconds) when the transaction was initiated. */
  localTimestamp: number;
  /** Any additional data associated with the transaction. */
  payload?: object;
  /** Indicates if the transaction is still pending confirmation. */
  pending: boolean;
  /** The final status of the transaction. */
  status?: TransactionStatus;
  /** A title for the transaction, with states for [pending, success, error, replaced]. */
  title?: string | [string, string, string, string];
  /** The specific tracker responsible for monitoring this transaction (e.g., 'evm', 'safe', 'gelato', etc.). */
  tracker: T;
  /** The unique key for the transaction within its tracker (e.g., EVM hash, Gelato task ID). */
  txKey: string;
  /** The type or category of the transaction (e.g., 'increment', 'approve'). */
  type: string;
  /** The type of wallet used for the transaction. */
  walletType: string;
};

/**
 * Represents an EVM-specific transaction, extending the base properties.
 * @template T The type of the tracker identifier.
 */
export type EvmTransaction<T> = BaseTransaction<T> & {
  /** The transaction adapter type. */
  adapter: TransactionAdapter.EVM;
  /** The on-chain transaction hash, available after submission. */
  hash?: string;
  /** The data payload for the transaction, typically for contract interactions. */
  input?: string;
  /** The maximum fee per gas for the transaction (EIP-1559). */
  maxFeePerGas?: string;
  /** The maximum priority fee per gas for the transaction (EIP-1559). */
  maxPriorityFeePerGas?: string;
  /** The transaction nonce. */
  nonce?: number;
  /** The hash of a transaction that this one replaced (e.g., for speed-up). */
  replacedTxHash?: string;
  /** The recipient's address. */
  to?: string;
  /** The value (in wei) being sent with the transaction. */
  value?: string;
};

/**
 * Represents a Solana-specific transaction, extending the base properties.
 * @template T The type of the tracker identifier.
 */
export type SolanaTransaction<T> = BaseTransaction<T> & {
  /** The transaction adapter type. */
  adapter: TransactionAdapter.SOLANA;
  /** The transaction fee. */
  fee?: number;
  /** The instructions included in the transaction. */
  instructions?: any[];
  /** The recent blockhash used for the transaction. */
  recentBlockhash?: string;
  /** The slot in which the transaction was processed. */
  slot?: number;
};

/**
 * Represents a Starknet-specific transaction, extending the base properties.
 * @template T The type of the tracker identifier.
 */
export type StarknetTransaction<T> = BaseTransaction<T> & {
  /** The actual fee paid for the transaction. */
  actualFee?: { amount: string; unit: string };
  /** The address of the contract being interacted with. */
  contractAddress?: string;
  /** The transaction adapter type. */
  adapter: TransactionAdapter.Starknet;
  /** The reason for transaction failure, if applicable. */
  revertReason?: string;
};

/** A union type representing any possible transaction structure. */
export type Transaction<T> = EvmTransaction<T> | SolanaTransaction<T> | StarknetTransaction<T>;

/**
 * Represents the parameters required to initiate a new transaction.
 */
export type InitialTransactionParams = {
  /** The transaction adapter type. */
  adapter: TransactionAdapter;
  /** A key identifying the retry logic from the actions registry. */
  actionKey?: string;
  /** A description for the transaction, with states for [pending, success, error, replaced]. */
  description?: string | [string, string, string, string];
  /** The ID of the desired blockchain network. */
  desiredChainID: number | string;
  /** Any additional data to be associated with the transaction. */
  payload?: object;
  /** A title for the transaction, with states for [pending, success, error, replaced]. */
  title?: string | [string, string, string, string];
  /** The type or category of the transaction (e.g., 'increment', 'approve'). */
  type: string;
  /** If true, the detailed tracking modal will open automatically for this transaction. */
  withTrackedModal?: boolean;
  /** Wallet address from. */
  from: string;
  /** Type of the wallet. (injected, wallet connect, etc.) */
  walletType: string;
};

/**
 * Represents a transaction in its initial, pre-submission state within the store.
 * This is used for UI feedback while the transaction is being signed and sent.
 */
export type InitialTransaction = InitialTransactionParams & {
  /** An error message if the initialization process fails (e.g., user rejects signature). */
  errorMessage?: string;
  /** True if the transaction is currently being processed (e.g., waiting for user signature). */
  isInitializing: boolean;
  /** The key of the on-chain transaction that this action produced, used for linking. */
  lastTxKey?: string;
  /** The local timestamp when the user initiated the action. */
  localTimestamp: number;
};

export type TxAdapter<TR, T extends Transaction<TR>, A> = {
  key: TransactionAdapter;
  checkChainForTx: (chainId: string | number) => Promise<void>;
  checkTransactionsTracker: (actionTxKey: A, walletType: string) => { txKey: string; tracker: TR };
  checkAndInitializeTrackerInStore: ({
    tx,
    ...rest
  }: { tx: T } & Pick<
    ITxTrackingStore<TR, T, A>,
    'transactionsPool' | 'updateTxParams' | 'onSucceedCallbacks' | 'removeTxFromPool'
  >) => Promise<void>;
};

/**
 * Interface for the complete transaction tracking store.
 * @template TR The type of the tracker identifier.
 * @template T The transaction type.
 * @template C The configuration object type (e.g., wagmi config).
 * @template A The return type of the action function being wrapped.
 */
export type ITxTrackingStore<TR, T extends Transaction<TR>, A> = IInitializeTxTrackingStore<TR, T> & {
  /**
   * A wrapper function that handles the entire lifecycle of a transaction.
   * It creates an `InitialTransaction`, executes the on-chain action, and tracks its status.
   * @param params - The parameters for handling the transaction.
   */
  handleTransaction: (params: {
    /** The async function to execute (e.g., a smart contract write call). */
    actionFunction: () => Promise<A | undefined>;
    /** The metadata for the transaction to be created, of type `InitialTransactionParams`. */
    params: InitialTransactionParams;

    defaultTracker?: TR;
  }) => Promise<void>;

  /**
   * Initializes all active trackers for pending transactions in the pool.
   * This is useful for resuming tracking after a page reload.
   */
  initializeTransactionsPool: () => Promise<void>;
};
