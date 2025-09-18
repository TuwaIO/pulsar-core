/**
 * @file This file defines the core data structures and TypeScript types for the Pulsar transaction tracking engine.
 * It specifies the framework-agnostic models for transactions, their lifecycle statuses, and the interfaces for
 * the Zustand-based store and chain-specific adapters.
 */

import { StoreApi } from 'zustand';

// =================================================================================================
// 1. ZUSTAND UTILITY TYPES
// =================================================================================================

/**
 * A utility type for creating modular Zustand store slices, enabling composable state management.
 * @template T The state slice being defined.
 * @template S The full store state that includes the slice `T`.
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
  /** The tracker for monitoring standard Solana transaction signatures. */
  Solana = 'solana',
}

/**
 * Represents the terminal status of a transaction after it has been processed.
 */
export enum TransactionStatus {
  /** The transaction failed to execute due to an on-chain error or rejection. */
  Failed = 'Failed',
  /** The transaction was successfully mined and included in a block. */
  Success = 'Success',
  /** The transaction was replaced by another with the same nonce (e.g., a speed-up or cancel). */
  Replaced = 'Replaced',
}

/**
 * Defines the shape of the identifier for a Gelato transaction task.
 */
export type GelatoTxKey = {
  taskId: string;
};

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
export type ActionTxKey = `0x${string}` | GelatoTxKey | string;

/**
 * The fundamental structure for any transaction being tracked by Pulsar.
 * This serves as the base upon which chain-specific transaction types are built.
 */
export type BaseTransaction = {
  /** The chain identifier (e.g., 1 for Ethereum Mainnet, 'SN_MAIN' for Starknet). */
  chainId: number | string;
  /**
   * User-facing description. Can be a single string for all states, or a tuple for specific states.
   * @example
   * // A single description for all states
   * description: 'Swap 1 ETH for 1,500 USDC'
   * // Specific descriptions for each state in order: [pending, success, error, replaced]
   * description: ['Swapping...', 'Swapped Successfully', 'Swap Failed', 'Swap Replaced']
   */
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
  /**
   * User-facing title. Can be a single string for all states, or a tuple for specific states.
   * @example
   * // A single title for all states
   * title: 'ETH/USDC Swap'
   * // Specific titles for each state in order: [pending, success, error, replaced]
   * title: ['Processing Swap', 'Swap Complete', 'Swap Error', 'Swap Replaced']
   */
  title?: string | [string, string, string, string];
  /** The specific tracker responsible for monitoring this transaction's status. */
  tracker: TransactionTracker;
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
 */
export type EvmTransaction = BaseTransaction & {
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
 */
export type SolanaTransaction = BaseTransaction & {
  adapter: TransactionAdapter.SOLANA;
  /** The transaction fee in lamports. */
  fee?: number;
  /** The instructions included in the transaction. */
  instructions?: unknown[];
  /** The recent blockhash used for the transaction. */
  recentBlockhash?: string;
  /** The slot in which the transaction was processed. */
  slot?: number;
  /** The number of confirmations received. `string` when tx successed. `null` if the transaction is pending or unconfirmed. */
  confirmations?: number | string | null;
  /** The RPC URL used to submit and track this transaction. */
  rpcUrl?: string;
};

/**
 * Represents a Starknet-specific transaction, extending the base properties.
 */
export type StarknetTransaction = BaseTransaction & {
  adapter: TransactionAdapter.Starknet;
  /** The actual fee paid for the transaction. */
  actualFee?: { amount: string; unit: string };
  /** The address of the contract being interacted with. */
  contractAddress?: string;
};

/** A union type representing any possible transaction structure that Pulsar can handle. */
export type Transaction = EvmTransaction | SolanaTransaction | StarknetTransaction;

// =================================================================================================
// 4. INITIAL TRANSACTION TYPES
// =================================================================================================

/**
 * Represents the parameters required to initiate a new transaction tracking flow.
 */
export type InitialTransactionParams = {
  adapter: TransactionAdapter;
  /** The function that executes the on-chain action (e.g., sending a transaction) and returns a preliminary identifier like a hash. */
  actionFunction: (...args: any[]) => Promise<ActionTxKey | undefined>;
  /** A user-facing description for the transaction. Supports state-specific descriptions. */
  description?: string | [string, string, string, string];
  /** The target chain ID for the transaction. */
  desiredChainID: number | string;
  /** Any custom data to associate with the transaction. */
  payload?: object;
  /** A user-facing title for the transaction. Supports state-specific titles. */
  title?: string | [string, string, string, string];
  /** The application-specific type of the transaction. */
  type: string;
  /** If true, the detailed tracking modal will open automatically upon initiation. */
  withTrackedModal?: boolean;
  /** The RPC URL to use for the transaction. Required for Solana transactions. */
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

export type OnSuccessCallback<T extends Transaction> = {
  /** Callback to execute when the transaction is successfully submitted. */
  onSuccessCallback?: (tx: T) => Promise<void> | void;
};

export type Adapter<T extends Transaction> = {
  adapter: TxAdapter<T> | TxAdapter<T>[];
};

/**
 * Defines the interface for a transaction adapter, which provides chain-specific logic and utilities.
 * @template T The specific transaction type, extending `Transaction`.
 */
export type TxAdapter<T extends Transaction> = {
  /** The unique key identifying this adapter. */
  key: TransactionAdapter;
  /** Returns information about the currently connected wallet. */
  getWalletInfo: () => {
    walletAddress: string;
    walletType: string;
  };
  /** Ensures the connected wallet is on the correct network for the transaction. Throws an error if the chain is mismatched. */
  checkChainForTx: (chainId: string | number) => Promise<void>;
  /** Determines the appropriate tracker and final `txKey` from the result of an action. */
  checkTransactionsTracker: (
    actionTxKey: ActionTxKey,
    walletType: string,
  ) => { txKey: string; tracker: TransactionTracker };
  /** Selects and initializes the correct background tracker for a given transaction. */
  checkAndInitializeTrackerInStore: (
    params: { tx: T } & OnSuccessCallback<T> &
      Pick<ITxTrackingStore<T>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'>,
  ) => Promise<void> | void;
  /** Returns the base URL for the blockchain explorer for the current network. */
  getExplorerUrl: (url?: string) => string | undefined;
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
      onClose: (txKey?: string) => void;
    } & Partial<Pick<ITxTrackingStore<T>, 'handleTransaction'>>,
  ) => Promise<void>;
  /**
   * Optional: Constructs a full explorer URL for a specific transaction.
   * May require the full transaction pool to resolve details for replaced transactions.
   */
  getExplorerTxUrl?: (tx: T) => string;
};

/**
 * Defines the structure of the transaction pool, a key-value store of transactions indexed by their unique keys.
 * @template T The type of the transaction object being tracked.
 */
export type TransactionPool<T extends Transaction> = Record<string, T>;

/**
 * A utility type that creates a union of all fields that can be safely updated
 * on a transaction object via the `updateTxParams` action. This ensures type safety
 * and prevents accidental modification of immutable properties.
 */
type UpdatableTransactionFields = Partial<
  Pick<
    EvmTransaction,
    | 'to'
    | 'nonce'
    | 'txKey'
    | 'pending'
    | 'hash'
    | 'status'
    | 'replacedTxHash'
    | 'errorMessage'
    | 'finishedTimestamp'
    | 'isTrackedModalOpen'
    | 'isError'
    | 'maxPriorityFeePerGas'
    | 'maxFeePerGas'
    | 'input'
    | 'value'
  >
> &
  Partial<Pick<SolanaTransaction, 'slot' | 'confirmations' | 'fee' | 'instructions' | 'recentBlockhash' | 'rpcUrl'>>;

/**
 * The interface for the base transaction tracking store slice.
 * It includes the state and actions for managing the transaction lifecycle.
 * @template T The specific transaction type.
 */
export interface IInitializeTxTrackingStore<T extends Transaction> {
  /** A pool of all transactions currently being tracked, indexed by `txKey`. */
  transactionsPool: TransactionPool<T>;
  /** The `txKey` of the most recently added transaction. */
  lastAddedTxKey?: string;
  /** The state for a transaction being initiated, used for UI feedback before it's submitted to the chain. */
  initialTx?: InitialTransaction;

  /** Adds a new transaction to the tracking pool and marks it as pending. */
  addTxToPool: (tx: T) => void;
  /** Updates one or more properties of an existing transaction in the pool. */
  updateTxParams: (txKey: string, fields: UpdatableTransactionFields) => void;
  /** Removes a transaction from the tracking pool by its key. */
  removeTxFromPool: (txKey: string) => void;
  /** Closes the tracking modal for a transaction and clears any initial transaction state. */
  closeTxTrackedModal: (txKey?: string) => void;
  /** A selector function to retrieve the key of the last transaction added to the pool. */
  getLastTxKey: () => string | undefined;
}

/**
 * The complete interface for the Pulsar transaction tracking store.
 * @template T The transaction type.
 */
export type ITxTrackingStore<T extends Transaction> = IInitializeTxTrackingStore<T> & {
  getAdapter: () => TxAdapter<T> | TxAdapter<T>[];
  /**
   * The primary method for initiating and tracking a new transaction from start to finish.
   * It manages UI state, executes the on-chain action, and initiates background tracking.
   * @param params The parameters for handling the transaction.
   */
  handleTransaction: (
    params: {
      /** The async function to execute (e.g., a smart contract write call). Must return a unique key or undefined. */
      actionFunction: () => Promise<ActionTxKey | undefined>;
      /** The metadata for the transaction. */
      params: Omit<InitialTransactionParams, 'actionFunction'>;
      /** The default tracker to use if it cannot be determined automatically. */
      defaultTracker?: TransactionTracker;
    } & OnSuccessCallback<T>,
  ) => Promise<void>;

  /**
   * Initializes trackers for all pending transactions in the pool.
   * This is essential for resuming tracking after a page reload.
   */
  initializeTransactionsPool: () => Promise<void>;
};
