/**
 * @file This file defines the core data structures and TypeScript types for the Pulsar transaction tracking engine.
 * It includes types for transactions, their statuses, store interfaces, and utility types for Zustand slices.
 * These types are framework-agnostic and form the foundation of the entire tracking system.
 */

import { StoreApi } from 'zustand';

import { IInitializeTxTrackingStore, TransactionPool } from './store/initializeTxTrackingStore';

// =================================================================================================
// 1. ZUSTAND UTILITY TYPES
// =================================================================================================

/**
 * A utility type for creating modular Zustand store slices, enabling composable state management.
 * @template T - The type of the state slice.
 * @template S - The type of the full store state, defaulting to T.
 */
export type StoreSlice<T extends object, S extends object = T> = (
  set: StoreApi<S extends T ? S : S & T>['setState'],
  get: StoreApi<S extends T ? S : S & T>['getState'],
) => T;

// =================================================================================================
// 2. ENUMS AND CORE TRANSACTION TYPES
// =================================================================================================

/**
 * Defines the supported blockchain adapters. Each adapter corresponds to a specific chain architecture.
 */
export enum TransactionAdapter {
  /** For Ethereum Virtual Machine (EVM) compatible chains like Ethereum, Polygon, etc. */
  EVM = 'evm',
  /** For the Solana blockchain. */
  SOLANA = 'solana',
  /** For the Starknet L2 network. */
  Starknet = 'starknet',
}

/**
 * Represents the terminal status of a transaction after it has been processed.
 */
export enum TransactionStatus {
  /** The transaction failed to execute due to an on-chain error or rejection. */
  Failed = 'Failed',
  /** The transaction was successfully mined and executed. */
  Success = 'Success',
  /** The transaction was replaced by another with the same nonce (e.g., a speed-up or cancel). */
  Replaced = 'Replaced',
}

/**
 * The fundamental structure for any transaction being tracked by Pulsar.
 * This forms the base upon which chain-specific transaction types are built.
 * @template T - The type of the tracker identifier (e.g., 'ethereum', 'gelato', 'safe').
 */
export type BaseTransaction<T> = {
  /** A unique key identifying a re-executable action from the `TxActions` registry. */
  actionKey?: string;
  /** The chain identifier (e.g., 1 for Ethereum Mainnet, 'SN_MAIN' for Starknet). */
  chainId: number | string;
  /** A user-facing description. Can be a single string or an array for [pending, success, error, replaced] states. */
  description?: string | [string, string, string, string];
  /** The error message if the transaction failed. */
  errorMessage?: string;
  /** The on-chain timestamp (in seconds) when the transaction was finalized. */
  finishedTimestamp?: number;
  /** The sender's wallet address. */
  from: string;
  /** A flag indicating if the transaction is in a failed state. */
  isError?: boolean;
  /** A UI flag to control the visibility of a detailed tracking modal for this transaction. */
  isTrackedModalOpen?: boolean;
  /** The local timestamp (in seconds) when the transaction was initiated by the user. */
  localTimestamp: number;
  /** Any additional, custom data associated with the transaction. */
  payload?: object;
  /** A flag indicating if the transaction is still awaiting on-chain confirmation. */
  pending: boolean;
  /** The final on-chain status of the transaction. */
  status?: TransactionStatus;
  /** A user-facing title. Can be a single string or an array for [pending, success, error, replaced] states. */
  title?: string | [string, string, string, string];
  /** The specific tracker responsible for monitoring this transaction's status. */
  tracker: T;
  /** The unique identifier for the transaction (e.g., EVM hash, Gelato task ID). */
  txKey: string;
  /** The application-specific type or category of the transaction (e.g., 'SWAP', 'APPROVE'). */
  type: string;
  /** The type of wallet used to sign the transaction (e.g., 'injected', 'walletConnect'). */
  walletType: string;
};

// =================================================================================================
// 3. CHAIN-SPECIFIC TRANSACTION TYPES
// =================================================================================================

/**
 * Represents an EVM-specific transaction, extending the base properties with EVM fields.
 * @template T - The type of the tracker identifier.
 */
export type EvmTransaction<T> = BaseTransaction<T> & {
  adapter: TransactionAdapter.EVM;
  /** The on-chain transaction hash, available after submission. */
  hash?: `0x${string}`;
  /** The data payload for the transaction, typically for smart contract interactions. */
  input?: `0x${string}`;
  /** The maximum fee per gas for an EIP-1559 transaction (in wei). */
  maxFeePerGas?: string;
  /** The maximum priority fee per gas for an EIP-1559 transaction (in wei). */
  maxPriorityFeePerGas?: string;
  /** The transaction nonce, a sequential number for the sender's account. */
  nonce?: number;
  /** The hash of a transaction that this one replaced. */
  replacedTxHash?: `0x${string}`;
  /** The recipient's address or contract address. */
  to?: `0x${string}`;
  /** The amount of native currency (in wei) being sent. */
  value?: string;
};

/**
 * Represents a Solana-specific transaction, extending the base properties.
 * @template T - The type of the tracker identifier.
 */
export type SolanaTransaction<T> = BaseTransaction<T> & {
  adapter: TransactionAdapter.SOLANA;
  /** The transaction fee in lamports. */
  fee?: number;
  /** The instructions included in the transaction. */
  instructions?: unknown[];
  /** The recent blockhash used for the transaction. */
  recentBlockhash?: string;
  /** The slot in which the transaction was processed. */
  slot?: number;
  /** The number of confirmations the transaction has received, or null if the transaction is still pending. */
  confirmations?: number | null;
  /** The RPC URL used for the transaction. */
  rpcUrl?: string;
};

/**
 * Represents a Starknet-specific transaction, extending the base properties.
 * @template T - The type of the tracker identifier.
 */
export type StarknetTransaction<T> = BaseTransaction<T> & {
  adapter: TransactionAdapter.Starknet;
  /** The actual fee paid for the transaction. */
  actualFee?: { amount: string; unit: string };
  /** The address of the contract being interacted with. */
  contractAddress?: string;
  /** The reason for transaction failure, if applicable. */
  revertReason?: string;
};

/** A union type representing any possible transaction structure that Pulsar can handle. */
export type Transaction<T> = EvmTransaction<T> | SolanaTransaction<T> | StarknetTransaction<T>;

// =================================================================================================
// 4. INITIAL TRANSACTION AND ACTION TYPES
// =================================================================================================

/**
 * A registry of functions that can be re-executed, keyed by `actionKey`.
 * Used for implementing "Retry" functionality.
 */
export type TxActions = Record<string, (...args: any[]) => Promise<unknown>>;

/**
 * Represents the parameters required to initiate a new transaction tracking flow.
 */
export type InitialTransactionParams = {
  adapter: TransactionAdapter;
  /** A key to identify the re-executable action from the `TxActions` registry. */
  actionKey?: string;
  /** A user-facing description for the transaction. */
  description?: string | [string, string, string, string];
  /** The target chain ID for the transaction. */
  desiredChainID: number | string;
  /** Any custom data to associate with the transaction. */
  payload?: object;
  /** A user-facing title for the transaction. */
  title?: string | [string, string, string, string];
  /** The application-specific type of the transaction. */
  type: string;
  /** If true, the detailed tracking modal will open automatically upon initiation. */
  withTrackedModal?: boolean;
  /** Required for Solana transactions. The RPC URL to use for the transaction. */
  rpcUrl?: string;
};

/**
 * Represents a transaction in its temporary, pre-submission state.
 * This is used for UI feedback while the transaction is being signed and sent.
 */
export type InitialTransaction = InitialTransactionParams & {
  /** An error message if the initialization fails (e.g., user rejects signature). */
  errorMessage?: string;
  /** A flag indicating if the transaction is being processed (e.g., waiting for signature). */
  isInitializing: boolean;
  /** The `txKey` of the on-chain transaction that this action produced, used for linking the states. */
  lastTxKey?: string;
  /** The local timestamp when the user initiated the action. */
  localTimestamp: number;
};

// =================================================================================================
// 5. ADAPTER AND STORE INTERFACES
// =================================================================================================

/**
 * Defines the interface for a transaction adapter, which provides chain-specific logic and utilities.
 * @template TR - The type of the tracker identifier (e.g., a string enum).
 * @template T - The specific transaction type, extending `Transaction<TR>`.
 * @template A - The type of the key returned by the `actionFunction` (e.g., a transaction hash).
 */
export type TxAdapter<TR, T extends Transaction<TR>, A> = {
  /** The unique key identifying this adapter. */
  key: TransactionAdapter;
  /** Returns information about the currently connected wallet. */
  getWalletInfo: () => {
    walletAddress: string;
    walletType: string;
  };
  /** Ensures the connected wallet is on the correct network for the transaction. */
  checkChainForTx: (chainId: string | number) => Promise<void>;
  /** Determines the appropriate tracker and final `txKey` based on the result of an action. */
  checkTransactionsTracker: (actionTxKey: A, walletType: string) => { txKey: string; tracker: TR };
  /** Initializes the correct background tracker for a given transaction. */
  checkAndInitializeTrackerInStore: (
    params: { tx: T } & Pick<
      ITxTrackingStore<TR, T, A>,
      'transactionsPool' | 'updateTxParams' | 'onSucceedCallbacks' | 'removeTxFromPool'
    >,
  ) => Promise<void>;
  /** Returns the base URL for the blockchain explorer. */
  getExplorerUrl: () => string | undefined;
  /** Optional: Fetches a name from a chain-specific name service (e.g., ENS). */
  getName?: (address: string) => Promise<string | null>;
  /** Optional: Fetches an avatar URL from a chain-specific name service. */
  getAvatar?: (name: string) => Promise<string | null>;
  /** Optional: Logic to cancel a pending EVM transaction. */
  cancelTxAction?: (tx: T) => Promise<string>;
  /** Optional: Logic to speed up a pending EVM transaction. */
  speedUpTxAction?: (tx: T) => Promise<string>;
  /** Optional: Logic to retry a failed transaction. */
  retryTxAction?: (
    params: {
      txKey: string;
      tx: InitialTransactionParams;
      actions?: TxActions;
      onClose: (txKey?: string) => void;
    } & Partial<Pick<ITxTrackingStore<TR, T, A>, 'handleTransaction'>>,
  ) => Promise<void>;
  /** Optional: Constructs a full explorer URL for a specific transaction. */
  getExplorerTxUrl?: (transactionsPool: TransactionPool<TR, T>, txKey: string, replacedTxHash?: string) => string;
};

/**
 * The complete interface for the Pulsar transaction tracking store.
 * @template TR - The type of the tracker identifier.
 * @template T - The transaction type.
 * @template A - The return type of the `actionFunction`.
 */
export type ITxTrackingStore<TR, T extends Transaction<TR>, A> = IInitializeTxTrackingStore<TR, T> & {
  /**
   * The core function that handles the entire lifecycle of a new transaction.
   * It manages UI state, executes the on-chain action, and initiates background tracking.
   * @param params - The parameters for handling the transaction.
   */
  handleTransaction: (params: {
    /** The async function to execute (e.g., a smart contract write call). Must return a unique key or undefined. */
    actionFunction: () => Promise<A | undefined>;
    /** The metadata for the transaction. */
    params: InitialTransactionParams;
    /** The default tracker to use if it cannot be determined automatically. */
    defaultTracker?: TR;
  }) => Promise<void>;

  /**
   * Initializes trackers for all pending transactions in the pool.
   * This is essential for resuming tracking after a page reload.
   */
  initializeTransactionsPool: () => Promise<void>;
};
