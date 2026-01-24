import { BaseAdapter, OrbitAdapter, OrbitGenericAdapter } from '@tuwaio/orbit-core';
import { StoreApi } from 'zustand';

/**
 * A utility type for creating modular Zustand store slices, enabling composable state management.
 * @template T The state slice being defined.
 * @template S The full store state that includes the slice `T`.
 */
export type StoreSlice<T extends object, S extends object = T> = (
  set: StoreApi<S extends T ? S : S & T>['setState'],
  get: StoreApi<S extends T ? S : S & T>['getState'],
) => T;

/**
 * Enum representing the different tracking strategies available for transactions.
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
  /** The unique identifier assigned by the Gelato relay service. */
  taskId: string;
};

/**
 * A union type representing the unique identifier returned by an `actionFunction`
 * after a transaction is submitted to the network or a relay service.
 *
 * This key is crucial for the adapter to determine which tracker should
 * monitor the transaction.
 *
 * It can be one of the following:
 * - A standard `0x...` transaction hash (`Hex`).
 * - A structured object from a relay service like Gelato (`GelatoTxKey`).
 * - A Solana transaction signature (string).
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
  /** The unique identifier for the transaction (e.g., EVM hash, Solana signature, or Gelato task ID). */
  txKey: string;
  /** The application-specific type or category of the transaction (e.g., 'SWAP', 'APPROVE'). */
  type: string;
  /** The type of connector used to sign the transaction (e.g., 'injected', 'walletConnect'). */
  connectorType: string;
};

// =================================================================================================
// 3. CHAIN-SPECIFIC TRANSACTION TYPES
// =================================================================================================

/**
 * Represents an EVM-specific transaction, extending the base properties with EVM fields.
 */
export type EvmTransaction = BaseTransaction & {
  /** The adapter type for EVM transactions. */
  adapter: OrbitAdapter.EVM;
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
  /** The adapter type for Solana transactions. */
  adapter: OrbitAdapter.SOLANA;
  /** The transaction fee in lamports. */
  fee?: number;
  /** The instructions included in the transaction. */
  instructions?: unknown[];
  /** The recent blockhash used for the transaction. */
  recentBlockhash?: string;
  /** The slot in which the transaction was processed. */
  slot?: number;
  /** The number of confirmations received. A string value indicates a confirmed transaction, while `null` means it's pending. */
  confirmations?: number | string | null;
  /** The RPC URL used to submit and track this transaction. */
  rpcUrl?: string;
};

/**
 * Represents a Starknet-specific transaction, extending the base properties.
 */
export type StarknetTransaction = BaseTransaction & {
  /** The adapter type for Starknet transactions. */
  adapter: OrbitAdapter.Starknet;
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
  /** The specific blockchain adapter for this transaction. */
  adapter: OrbitAdapter;
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

/**
 * Defines the standard callback structure for transaction events.
 * @template T The specific transaction type, extending `Transaction`.
 */
export interface TrackerCallbacks<T extends Transaction> {
  onSuccess?: (tx: T) => Promise<void> | void;
  onError?: (error: unknown, tx?: T) => Promise<void> | void;
  onReplaced?: (newTx: T, oldTx: T) => Promise<void> | void;
}

/**
 * @deprecated Use `TrackerCallbacks<T>` instead.
 * Defines a callback function to be executed upon a successful transaction.
 * @template T The specific transaction type, extending `Transaction`.
 */
export type OnSuccessCallback<T extends Transaction> = {
  /** Callback to execute when the transaction is successfully submitted. */
  onSuccessCallback?: (tx: T) => Promise<void> | void;
};

/**
 * The configuration object containing one or more transaction adapters.
 * @template T The specific transaction type.
 */
export type PulsarAdapter<T extends Transaction> = OrbitGenericAdapter<TxAdapter<T>> & { maxTransactions?: number };

/**
 * Defines the interface for a transaction adapter, which provides chain-specific logic and utilities.
 * @template T The specific transaction type, extending `Transaction`.
 */
export type TxAdapter<T extends Transaction> = Pick<BaseAdapter, 'getExplorerUrl'> & {
  /** The unique key identifying this adapter. */
  key: OrbitAdapter;
  /** Returns information about the currently connected connector. */
  getConnectorInfo: () => {
    /** The currently connected wallet address. */
    walletAddress: string;
    /** The type of the connector (e.g., 'metamask', 'phantom'). */
    connectorType: string;
  };
  /**
   * Ensures the connected wallet is on the correct network for the transaction.
   *
   * This method should throw an error if the chain is mismatched.
   * @param chainId The desired chain ID for the transaction.
   * @param walletChainId The connected wallet chain ID.
   */
  checkChainForTx: (chainId: string | number) => Promise<void>;
  /**
   * Determines the appropriate tracker and final `txKey` from the result of an action.
   * @param actionTxKey The preliminary key returned after an action function is executed.
   * @param connectorType The type of connector used for the transaction.
   * @returns An object containing the final `txKey` and the `TransactionTracker` to be used.
   */
  checkTransactionsTracker: (
    actionTxKey: ActionTxKey,
    connectorType: string,
  ) => { txKey: string; tracker: TransactionTracker };
  /**
   * Selects and initializes the correct background tracker for a given transaction.
   * @param params The parameters for initializing the tracker, including the transaction and store callbacks.
   */
  checkAndInitializeTrackerInStore: (
    params: { tx: T } & TrackerCallbacks<T> &
      Pick<ITxTrackingStore<T>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'>,
  ) => Promise<void> | void;
  /**
   * Optional: Logic to cancel a pending EVM transaction.
   * @param tx The transaction to cancel.
   * @returns The new transaction hash for the cancellation.
   */
  cancelTxAction?: (tx: T) => Promise<string>;
  /**
   * Optional: Logic to speed up a pending EVM transaction.
   * @param tx The transaction to speed up.
   * @returns The new transaction hash for the sped-up transaction.
   */
  speedUpTxAction?: (tx: T) => Promise<string>;
  /**
   * Optional: Logic to retry a failed transaction.
   * @param params The parameters for retrying the transaction.
   * @param params.txKey The unique key of the transaction to retry.
   * @param params.tx The initial parameters of the transaction.
   * @param params.onClose Callback function to close the tracking modal.
   */
  retryTxAction?: (
    params: {
      txKey: string;
      tx: InitialTransactionParams;
      onClose: (txKey?: string) => void;
    } & Partial<Pick<ITxTrackingStore<T>, 'executeTxAction'>>,
  ) => Promise<void>;
  /**
   * Optional: Constructs a full explorer URL for a specific transaction.
   * May require the full transaction pool to resolve details for replaced transactions.
   * @param tx The transaction object.
   * @returns The full URL to the transaction on the explorer.
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
  /** The state for a transaction being initiated, used for verify feedback before it's submitted to the chain. */
  initialTx?: InitialTransaction;
  /**
   * Adds a new transaction to the tracking pool and marks it as pending.
   * @param tx The transaction object to add.
   */
  addTxToPool: (tx: T) => void;
  /**
   * Updates one or more properties of an existing transaction in the pool.
   * @param txKey The key of the transaction to update.
   * @param fields The partial object containing the fields to update.
   */
  updateTxParams: (txKey: string, fields: UpdatableTransactionFields) => void;
  /**
   * Removes a transaction from the tracking pool by its key.
   * @param txKey The key of the transaction to remove.
   */
  removeTxFromPool: (txKey: string) => void;
  /**
   * Closes the tracking modal for a transaction and clears any initial transaction state.
   * @param txKey The optional key of the transaction modal to close.
   */
  closeTxTrackedModal: (txKey?: string) => void;
  /**
   * A selector function to retrieve the key of the last transaction added to the pool.
   * @returns The key of the last added transaction, or undefined if none exists.
   */
  getLastTxKey: () => string | undefined;
}

/**
 * The complete interface for the Pulsar transaction tracking store.
 * @template T The transaction type.
 */
export type ITxTrackingStore<T extends Transaction> = IInitializeTxTrackingStore<T> & {
  /** A getter function that returns the configured transaction adapter(s). */
  getAdapter: () => TxAdapter<T> | TxAdapter<T>[];
  /**
   * The primary method for initiating and tracking a new transaction from start to finish.
   * It manages UI state, executes the on-chain action, and initiates background tracking.
   *
   * @param params The parameters for handling the transaction.
   * @param params.actionFunction The async function to execute (e.g., a smart contract write call). Must return a unique key or undefined.
   * @param params.params The metadata for the transaction.
   * @param params.defaultTracker The default tracker to use if it cannot be determined automatically.
   * @param params.onSuccess Callback to execute when the transaction is successfully submitted.
   * @param params.onError Callback to execute when the transaction fails.
   * @param params.onReplaced Callback to execute when the transaction is replaced.
   */
  executeTxAction: (
    params: {
      actionFunction: () => Promise<ActionTxKey | undefined>;
      params: Omit<InitialTransactionParams, 'actionFunction'>;
      defaultTracker?: TransactionTracker;
    } & TrackerCallbacks<T>,
  ) => Promise<void>;

  /**
   * Initializes trackers for all pending transactions in the pool.
   * This is essential for resuming tracking after a page reload or application restart.
   */
  initializeTransactionsPool: () => Promise<void>;
};
