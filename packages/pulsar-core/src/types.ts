/**
 * @file Core types of Pulsar: transaction shapes, the adapter contract that chain packages implement, and the state
 * and actions of the transaction stores.
 */

import { BaseAdapter, OrbitAdapter, OrbitGenericAdapter, TuwaErrorState } from '@tuwaio/orbit-core';
import { StoreApi } from 'zustand';

/**
 * A Zustand slice creator: receives the store's `set` and `get` and returns the slice state and actions.
 *
 * @template T - The state slice being defined.
 * @template S - The full store state that includes the slice `T`.
 */
export type StoreSlice<T extends object, S extends object = T> = (
  set: StoreApi<S extends T ? S : S & T>['setState'],
  get: StoreApi<S extends T ? S : S & T>['getState'],
) => T;

/**
 * Tracking strategy of a transaction. The chain adapter picks it after the action returns (see
 * `TxAdapter.checkTransactionsTracker`) and routes the transaction to the matching tracker.
 */
export enum TransactionTracker {
  /** A standard EVM transaction, tracked by its hash through RPC (`@tuwaio/pulsar-evm`). */
  Ethereum = 'ethereum',
  /** A Safe multisig transaction, tracked by its `safeTxHash` through the Safe Transaction Service API. */
  Safe = 'safe',
  /**
   * A meta-transaction relayed by Gelato, tracked by its task ID through the Gelato API.
   * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.
   */
  Gelato = 'gelato',
  /** A Solana transaction, tracked by its signature through RPC (`@tuwaio/pulsar-solana`). */
  Solana = 'solana',
  /** An ERC-4337 UserOperation, tracked by its `userOpHash` through a bundler RPC and then on-chain. */
  ERC4337 = 'erc4337',
}

/**
 * Terminal status of a transaction. Trackers set it together with `pending: false`.
 */
export enum TransactionStatus {
  /** The transaction reverted, was rejected, or tracking failed (for example, it was not found in time). */
  Failed = 'Failed',
  /** The transaction was included on-chain and executed successfully. */
  Success = 'Success',
  /** Another transaction with the same nonce was mined instead (a wallet speed-up or cancel). */
  Replaced = 'Replaced',
}

/**
 * The identifier returned by an `actionFunction` once the transaction is submitted: an EVM transaction hash, an
 * ERC-4337 `userOpHash`, a Safe `safeTxHash`, a Gelato task ID or a Solana signature. The adapter uses it to pick the
 * tracker and the `txKey` of the transaction.
 */
export type ActionTxKey = `0x${string}` | string;

/**
 * Fields shared by every tracked transaction. Chain-specific transaction types extend it.
 */
export type BaseTransaction = {
  /**
   * The chain of the transaction: the numeric chain ID for EVM (for example `1`), or `solana:<cluster>` for Solana
   * (for example `solana:devnet`). `executeTxAction` derives it from `desiredChainID`.
   */
  chainId: number | string;
  /**
   * User-facing description: one string for every state, or a tuple for the `[pending, success, error, replaced]`
   * states. Each string must be 300 characters or less and must not contain executable-like patterns such as `eval(`
   * or `javascript:`; `executeTxAction`, `addTxToPool` and the pool restore functions reject or drop transactions that
   * break these rules.
   * @example
   * ```ts
   * description: 'Swap 1 ETH for 1,500 USDC';
   * description: ['Swapping...', 'Swapped successfully', 'Swap failed', 'Swap replaced'];
   * ```
   */
  description?: string | [string, string, string, string];
  /** The normalized error of a failed transaction (`normalizeError` from `@tuwaio/orbit-core`). */
  error?: TuwaErrorState;
  /**
   * Unix timestamp (seconds) of the terminal state: the block timestamp for EVM and ERC-4337 transactions confirmed
   * on-chain, the execution date for Safe, and the local time otherwise.
   */
  finishedTimestamp?: number;
  /** The address of the wallet that sent the transaction, as reported by the adapter's `getConnectorInfo`. */
  from: string;
  /** `true` when the transaction failed; set by trackers together with `status: Failed`. */
  isError?: boolean;
  /** UI flag for a detailed tracking modal. Set from `withTrackedModal`; `closeTxTrackedModal` sets it to `false`. */
  isTrackedModalOpen?: boolean;
  /** Unix timestamp (seconds) when `executeTxAction` started. The pool is ordered and evicted by this value. */
  localTimestamp: number;
  /**
   * Custom JSON data of the application. The UTF-8 JSON must be 10 KB or less, and string keys and values must not
   * contain executable-like patterns.
   */
  payload?: Record<string, string | number>;
  /** `true` while the transaction is tracked; trackers set it to `false` when it reaches a terminal status. */
  pending: boolean;
  /** The terminal status, set together with `pending: false`. */
  status?: TransactionStatus;
  /**
   * User-facing title: one string for every state, or a tuple for the `[pending, success, error, replaced]` states.
   * Each string must be 100 characters or less and must not contain executable-like patterns such as `eval(` or
   * `javascript:`.
   * @example
   * ```ts
   * title: 'ETH/USDC swap';
   * title: ['Processing swap', 'Swap complete', 'Swap error', 'Swap replaced'];
   * ```
   */
  title?: string | [string, string, string, string];
  /** The tracker that monitors the transaction. */
  tracker: TransactionTracker;
  /**
   * The key of the transaction in the pool: the transaction hash, `userOpHash` (ERC-4337), `safeTxHash` (Safe), Gelato
   * task ID or Solana signature.
   */
  txKey: string;
  /** Application-specific type of the transaction, for example `'SWAP'` or `'APPROVE'`. */
  type: string;
  /** The connector that signed the transaction, for example `evm:metamask` or `solana:phantom`. */
  connectorType: string;
  /**
   * Number of block confirmations the EVM trackers wait for before marking the transaction successful. Defaults to 1.
   * The Solana tracker always waits for the `finalized` commitment instead.
   */
  requiredConfirmations?: number;
  /**
   * Confirmations reported by the tracker while the transaction is pending. The Solana tracker sets it to `'MAX'` when
   * the transaction is finalized.
   */
  confirmations?: number | string | null;
  /**
   * RPC endpoint used by the Solana tracker, also after a page reload. Without it, the tracker uses the public
   * endpoint of the cluster in `chainId`.
   */
  rpcUrl?: string;
  /**
   * Remote sync state, set only when the store has an `onRemoteCreate` callback: `'pending-sync'` from the moment the
   * transaction is added until `onRemoteCreate` resolves (the key is listed in `unsyncedTxKeys` meanwhile and retried
   * if the call fails), then `'synced'`.
   */
  syncStatus?: 'synced' | 'pending-sync';
};

// =================================================================================================
// 3. CHAIN-SPECIFIC TRANSACTION TYPES
// =================================================================================================

/**
 * An EVM transaction. Trackers fill the on-chain fields (`hash`, `nonce`, fees, `to`, `value`, `input`) once the
 * transaction details are available.
 */
export type EvmTransaction = BaseTransaction & {
  /** Always `OrbitAdapter.EVM`. */
  adapter: OrbitAdapter.EVM;
  /**
   * The on-chain transaction hash: the `txKey` for standard transactions, and the hash of the mined transaction for
   * ERC-4337, Safe and Gelato once it is known.
   */
  hash?: `0x${string}`;
  /** The calldata of the transaction. */
  input?: `0x${string}`;
  /** EIP-1559 max fee per gas, in wei, as a decimal string. */
  maxFeePerGas?: string;
  /** EIP-1559 max priority fee per gas, in wei, as a decimal string. */
  maxPriorityFeePerGas?: string;
  /** The nonce of the sender account. */
  nonce?: number;
  /**
   * The hash of the transaction that replaced this one (set with `status: Replaced`). For Safe transactions it is the
   * `safeTxHash` of the transaction executed instead.
   */
  replacedTxHash?: `0x${string}`;
  /** The recipient or contract address. */
  to?: `0x${string}`;
  /** The native value sent, in wei, as a decimal string. */
  value?: string;
  /**
   * Custom bundler RPC URL used to track an ERC-4337 UserOperation. Stored with the transaction, so it is persisted to
   * `localStorage` and passed to `onRemoteCreate` (a backend can track through the same bundler). Keep API keys out of
   * this URL; pass them as `pimlicoApiKey`.
   */
  bundlerUrl?: string;
  /**
   * Pimlico API key used to track an ERC-4337 UserOperation when no `bundlerUrl` is set. Persisted to `localStorage`
   * with the transaction, so tracking can resume after a reload, but never passed to `onRemoteCreate`.
   */
  pimlicoApiKey?: string;
};

/**
 * A Solana transaction. The Solana tracker fills the on-chain fields once the transaction is found.
 */
export type SolanaTransaction = BaseTransaction & {
  /** Always `OrbitAdapter.SOLANA`. */
  adapter: OrbitAdapter.SOLANA;
  /** The transaction fee, in lamports. */
  fee?: number;
  /** The instructions of the transaction, as returned by the `getTransaction` RPC method. */
  instructions?: unknown[];
  /** The blockhash the transaction was signed with. */
  recentBlockhash?: string;
  /** The slot in which the transaction was processed. */
  slot?: number;
};

/**
 * A Starknet transaction. Reserved for a Starknet adapter; Pulsar does not ship one.
 */
export type StarknetTransaction = BaseTransaction & {
  /** Always `OrbitAdapter.Starknet`. */
  adapter: OrbitAdapter.Starknet;
  /** The actual fee paid for the transaction. */
  actualFee?: {
    /** The fee amount. */
    amount: string;
    /** The fee unit. */
    unit: string;
  };
  /** The address of the contract being interacted with. */
  contractAddress?: string;
};

/** Any transaction Pulsar can track. Application transaction types extend one of its members. */
export type Transaction = EvmTransaction | SolanaTransaction | StarknetTransaction;

// =================================================================================================
// 4. INITIAL TRANSACTION TYPES
// =================================================================================================

/**
 * The metadata of a transaction passed to `executeTxAction` (as `params`, without `actionFunction`) and kept in
 * `initialTx`.
 */
export type InitialTransactionParams = Pick<
  BaseTransaction,
  'description' | 'title' | 'type' | 'requiredConfirmations' | 'rpcUrl' | 'payload'
> &
  Pick<EvmTransaction, 'bundlerUrl' | 'pimlicoApiKey'> & {
    /** The adapter that handles the transaction. When no configured adapter has this key, the first one is used. */
    adapter: OrbitAdapter;
    /**
     * Signs and submits the transaction and returns its `ActionTxKey`, or `undefined` when the user cancelled.
     * `executeTxAction` calls it without arguments. The adapters' `retryTxAction` call it with
     * `{ config, ...payload }` (EVM) or `{ client, ...payload }` (Solana).
     * @param args - No arguments from `executeTxAction`; one object from `retryTxAction`.
     */
    actionFunction: (...args: unknown[]) => Promise<ActionTxKey | undefined>;
    /**
     * The chain the transaction must be sent on: a numeric chain ID for EVM (the wallet is asked to switch if needed),
     * or a cluster moniker such as `'devnet'` for Solana (compared with the cluster of the connected wallet).
     */
    desiredChainID: number | string;
    /** When `true`, the transaction is created with `isTrackedModalOpen: true`. */
    withTrackedModal?: boolean;
    /**
     * Forces a tracker. Required for ERC-4337 (`TransactionTracker.ERC4337`) and Gelato; otherwise the adapter picks
     * one from the returned key and the connector.
     */
    tracker?: TransactionTracker;
    /**
     * Stored with the transaction and persisted to `localStorage`, but never passed to `onRemoteCreate`.
     * @deprecated Gelato relay is deprecated. Use ERC-4337 with `bundlerUrl` or `pimlicoApiKey` instead.
     */
    gelatoApiKey?: string;
  };

/**
 * The state of a transaction while `executeTxAction` runs, before it is added to the pool. UI layers use it for
 * immediate feedback (signature prompts, preflight errors).
 */
export type InitialTransaction = InitialTransactionParams & {
  /** The normalized error when the flow failed before tracking started, for example a rejected signature. */
  error?: TuwaErrorState;
  /** `true` from the start of `executeTxAction` until the transaction is added to the pool or the flow fails. */
  isInitializing: boolean;
  /** The `txKey` of the transaction this action added to the pool. */
  lastTxKey?: string;
  /** Unix timestamp (seconds) when `executeTxAction` started. */
  localTimestamp: number;
};

// =================================================================================================
// 5. ADAPTER AND STORE INTERFACES
// =================================================================================================

/**
 * Callbacks passed to `executeTxAction` and forwarded to the tracker of that transaction. They are not stored:
 * trackers restarted by `initializeTransactionsPool` or `injectExternalPendingTxs` (for example after a page reload)
 * run without them. Their return values are not awaited.
 *
 * @template T - The application transaction type.
 */
export interface TrackerCallbacks<T extends Transaction> {
  /**
   * Called when the tracker marks the transaction `Success`.
   * @param tx - The transaction after the update.
   */
  onSuccess?: (tx: T) => Promise<void> | void;
  /**
   * Called when the transaction fails: it reverted, was rejected, or tracking gave up.
   * @param error - The raw error, or a generated `Error`.
   * @param tx - The transaction after the update.
   */
  onError?: (error: unknown, tx?: T) => Promise<void> | void;
  /**
   * Called when the transaction is replaced by another one with the same nonce.
   * @param newTx - The tracked transaction after the update (`status: Replaced`, `replacedTxHash` set).
   * @param oldTx - The transaction as tracking started.
   */
  onReplaced?: (newTx: T, oldTx: T) => Promise<void> | void;
}

/**
 * Callbacks that synchronize the local pool with a remote backend (for example Quasar). Passed to
 * `createPulsarStore`.
 *
 * @template T - The application transaction type.
 */
export interface SyncCallbacks<T extends Transaction> {
  /**
   * Called in the background with every new transaction, right after `addTxToPool` has written it to the pool with
   * `syncStatus: 'pending-sync'` and listed its key in `unsyncedTxKeys`. It never delays or blocks tracking. Resolving
   * marks the transaction `'synced'` and removes the key; rejecting logs a warning and leaves the key for
   * `reconcileUnsyncedTransactions`, also across reloads. Reject (throw) on failure: a resolved promise counts as
   * synced. A transaction is never sent twice at the same time.
   * @param tx - A copy of the pooled transaction without `pimlicoApiKey` and `gelatoApiKey`.
   */
  onRemoteCreate?: (tx: T) => Promise<void>;
}

/**
 * Preflight callback run by `executeTxAction` after metadata validation and the chain check (which can ask the wallet
 * to switch networks), before `actionFunction` asks the wallet to sign. It receives no transaction data.
 *
 * Throw to block the transaction: with `abortOnTxError` (default `true`), `initialTx.error` is set and
 * `executeTxAction` rejects with the thrown error. With `abortOnTxError: false`, the error is logged and the flow
 * continues.
 */
export type BeforeTxProcess = () => Promise<void> | void;

/**
 * The configuration of `createPulsarStore`: one or more chain adapters and the store options.
 *
 * @template T - The application transaction type.
 */
export type PulsarAdapter<T extends Transaction> = OrbitGenericAdapter<TxAdapter<T>> & {
  /** Global preflight callback run before every transaction. A `beforeTxProcess` passed to `executeTxAction` replaces it. */
  beforeTxProcess?: BeforeTxProcess;
  /** Maximum number of transactions in the pool. When it is full, the oldest one (by `localTimestamp`) is evicted. Defaults to 50. */
  maxTransactions?: number;
  /** @deprecated Gelato relay is deprecated. Gelato API key used to track `TransactionTracker.Gelato` transactions. */
  gelatoApiKey?: string;
  /**
   * Whether an error thrown by `beforeTxProcess` aborts the transaction. Defaults to `true`. It does not apply to
   * `onRemoteCreate`, whose errors never abort the transaction.
   */
  abortOnTxError?: boolean;
} & SyncCallbacks<T>;

/**
 * The input of `TxAdapter.checkTransactionsTracker`: the key returned by the action and the context needed to pick a
 * tracker.
 */
export type CheckTxTracker = {
  /** The key returned by `actionFunction`. */
  actionTxKey: ActionTxKey;
  /** The connector that signed the transaction, for example `evm:safe` for a Safe wallet. */
  connectorType: string;
  /** The tracker requested in `executeTxAction` params, if any. */
  tracker?: TransactionTracker;
  /** @deprecated Gelato relay is deprecated. Use `bundlerUrl` / `pimlicoApiKey` with ERC-4337 instead. */
  gelatoApiKey?: string;
  /** Custom bundler RPC URL for ERC-4337 UserOperation tracking. */
  bundlerUrl?: string;
  /** Pimlico API key for ERC-4337 UserOperation tracking. */
  pimlicoApiKey?: string;
};

/**
 * The contract a chain adapter implements to plug into the Pulsar store. `@tuwaio/pulsar-evm` and
 * `@tuwaio/pulsar-solana` provide implementations.
 *
 * @template T - The application transaction type.
 */
export type TxAdapter<T extends Transaction> = Pick<BaseAdapter, 'getExplorerUrl'> & {
  /** The chain family handled by the adapter. */
  key: OrbitAdapter;
  /** Returns the connected wallet. Called by `executeTxAction` before the chain check. */
  getConnectorInfo: () => {
    /** The address of the connected wallet. */
    walletAddress: string;
    /** The connector type, for example `evm:metamask`. */
    connectorType: string;
  };
  /**
   * Ensures the wallet is on the chain of the transaction, switching it if the adapter can. Rejects when the chain
   * does not match, which aborts `executeTxAction`.
   * @param chainId - The `desiredChainID` of the transaction.
   */
  checkChainForTx: (chainId: string | number) => Promise<void>;
  /**
   * Picks the tracker and the final `txKey` for the key returned by `actionFunction`.
   * @param params - The returned key, the connector type and the requested tracker.
   * @returns The `txKey` to store the transaction under and the tracker to use.
   */
  checkTransactionsTracker: (params: CheckTxTracker) => {
    /** The key the transaction is stored under. */
    txKey: string;
    /** The tracker that monitors the transaction. */
    tracker: TransactionTracker;
  };
  /**
   * Starts the background tracker of a transaction. Trackers update the transaction through `updateTxParams`. The
   * built-in trackers keep failed transactions in the pool; `removeTxFromPool` is available to custom trackers.
   * @param params - The transaction, the Gelato API key, the callbacks and the store members used by trackers.
   */
  checkAndInitializeTrackerInStore: (
    params: { tx: T; gelatoApiKey?: string } & TrackerCallbacks<T> &
      Pick<ITxTrackingStore<T>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'>,
  ) => Promise<void> | void;
  /**
   * Optional: cancels a pending transaction by sending a replacement with the same nonce.
   * @param tx - The transaction to cancel.
   * @returns The hash of the cancellation transaction.
   */
  cancelTxAction?: (tx: T) => Promise<string>;
  /**
   * Optional: speeds up a pending transaction by resending it with the same nonce and higher fees.
   * @param tx - The transaction to speed up.
   * @returns The hash of the replacement transaction.
   */
  speedUpTxAction?: (tx: T) => Promise<string>;
  /**
   * Optional: closes the tracking modal and runs a failed transaction again through `executeTxAction`.
   * @param params - The retry parameters.
   * @param params.txKey - The key of the failed transaction, passed to `onClose`.
   * @param params.tx - The parameters of the transaction, including its `actionFunction`.
   * @param params.onClose - Closes the tracking modal.
   * @param params.executeTxAction - The store's `executeTxAction`.
   */
  retryTxAction?: (
    params: {
      txKey: string;
      tx: InitialTransactionParams;
      onClose: (txKey?: string) => void;
    } & Partial<Pick<ITxTrackingStore<T>, 'executeTxAction'>>,
  ) => Promise<void>;
  /**
   * Optional: builds the explorer URL of a transaction.
   * @param tx - The transaction.
   * @returns The URL, or an empty string when it cannot be built.
   */
  getExplorerTxUrl?: (tx: T) => string;
};

/**
 * The transaction pool: transactions indexed by `txKey`.
 *
 * @template T - The application transaction type.
 */
export type TransactionPool<T extends Transaction> = Record<string, T>;

/**
 * The fields `updateTxParams` accepts: the fields trackers change while a transaction is tracked.
 */
export type UpdatableTransactionFields = Partial<
  Pick<
    EvmTransaction,
    | 'to'
    | 'nonce'
    | 'txKey'
    | 'pending'
    | 'hash'
    | 'status'
    | 'replacedTxHash'
    | 'error'
    | 'finishedTimestamp'
    | 'isTrackedModalOpen'
    | 'isError'
    | 'maxPriorityFeePerGas'
    | 'maxFeePerGas'
    | 'input'
    | 'value'
    | 'confirmations'
    | 'requiredConfirmations'
  >
> &
  Partial<Pick<SolanaTransaction, 'slot' | 'confirmations' | 'fee' | 'instructions' | 'recentBlockhash' | 'rpcUrl'>>;

/**
 * The state and actions of the core store slice created by `initializeTxTrackingStore`.
 *
 * @template T - The application transaction type.
 */
export interface IInitializeTxTrackingStore<T extends Transaction> {
  /** Every tracked transaction, indexed by `txKey`. Persisted to `localStorage` by `createPulsarStore`. */
  transactionsPool: TransactionPool<T>;
  /** The `txKey` of the transaction added last. */
  lastAddedTxKey?: string;
  /**
   * The transaction `executeTxAction` is processing, before it is added to the pool. Not persisted by
   * `createPulsarStore`: after a reload it is `undefined`.
   */
  initialTx?: InitialTransaction;
  /**
   * Validates a transaction and adds it to the pool with `pending: true`. When the pool already holds
   * `maxTransactions` transactions, the oldest one is evicted. If `onRemoteCreate` is configured, the transaction gets
   * `syncStatus: 'pending-sync'`, its key is listed in `unsyncedTxKeys`, and `onRemoteCreate` runs in the background
   * (see `SyncCallbacks`). Does not start a tracker.
   * @param tx - The transaction to add.
   * @returns A promise that resolves once the transaction is in the pool, without waiting for `onRemoteCreate`.
   * @throws `PulsarTransactionValidationError` synchronously, before anything is written, when the title, description
   * or payload is invalid.
   */
  addTxToPool: (tx: T) => Promise<void>;
  /**
   * Merges fields into a transaction of the pool; does nothing if the key is unknown. When `fields.status` is terminal
   * and the transaction is in `unsyncedTxKeys`, it starts `reconcileUnsyncedTransactions` in the background.
   * @param txKey - The key of the transaction.
   * @param fields - The fields to merge.
   */
  updateTxParams: (txKey: string, fields: UpdatableTransactionFields) => void;
  /**
   * Removes a transaction from the pool. Does not stop its tracker.
   * @param txKey - The key of the transaction.
   */
  removeTxFromPool: (txKey: string) => void;
  /**
   * Sets `isTrackedModalOpen: false` on a transaction and always clears `initialTx`.
   * @param txKey - The key of the transaction whose modal is closed, if any.
   */
  closeTxTrackedModal: (txKey?: string) => void;
  /**
   * Returns `lastAddedTxKey`.
   * @returns The key of the transaction added last, or `undefined`.
   */
  getLastTxKey: () => string | undefined;
  /**
   * Keys of transactions that `onRemoteCreate` has not confirmed yet: in flight, failed, or interrupted by a reload.
   * `reconcileUnsyncedTransactions` retries them. Persisted to `localStorage`.
   */
  unsyncedTxKeys?: Record<string, boolean>;
  /**
   * Calls `onRemoteCreate` again for every key in `unsyncedTxKeys`, one after another, skipping keys whose call is still
   * in flight. Successful transactions are marked `'synced'` and removed from the list; failures are logged and stay
   * listed; keys of transactions no longer in the pool are removed. Does nothing without `onRemoteCreate` or while a
   * previous run is in progress. Runs at the start of every `executeTxAction`, when an
   * unsynced transaction reaches a terminal status, and when `createTxInMemoryStore` loads the first history page.
   * @returns A promise that resolves when the run is finished. It does not reject.
   */
  reconcileUnsyncedTransactions: () => Promise<void>;
}

/**
 * The state and actions of the store created by `createPulsarStore`.
 *
 * @template T - The application transaction type.
 */
export type ITxTrackingStore<T extends Transaction> = IInitializeTxTrackingStore<T> & {
  /**
   * Returns the adapter configuration passed to `createPulsarStore`.
   * @returns The adapter, or the array of adapters.
   */
  getAdapter: () => TxAdapter<T> | TxAdapter<T>[];
  /**
   * Runs a transaction from start to tracking: validates `params`, sets `initialTx`, checks the chain (the EVM adapter
   * may ask the wallet to switch), runs `beforeTxProcess`, calls `actionFunction`, adds the transaction to the pool
   * (see `addTxToPool`) and starts its tracker. When `actionFunction` returns `undefined`, `initialTx` is cleared and
   * nothing is tracked. Also starts `reconcileUnsyncedTransactions` in the background.
   *
   * @param params - The action, its metadata and the callbacks.
   * @param params.actionFunction - Signs and submits the transaction; returns its key, or `undefined` if cancelled.
   * @param params.params - The transaction metadata. `title`, `description` and `payload` are validated before
   * anything else runs.
   * @param params.defaultTracker - Tracker used when the adapter does not return one.
   * @param params.beforeTxProcess - Preflight callback for this transaction; replaces the global one.
   * @param params.abortOnTxError - Overrides the global `abortOnTxError` for this transaction.
   * @param params.onSuccess - Called when the transaction succeeds (see `TrackerCallbacks`).
   * @param params.onError - Called when the transaction fails after it was submitted (see `TrackerCallbacks`).
   * @param params.onReplaced - Called when the transaction is replaced (see `TrackerCallbacks`).
   * @returns A promise that resolves when the adapter's `checkAndInitializeTrackerInStore` resolves: once polling has
   * started for polling trackers (Solana, Safe, ERC-4337, Gelato), but only when tracking has finished for standard
   * EVM transactions (`TransactionTracker.Ethereum`). Read the state from the store instead of awaiting the result.
   * @throws `PulsarTransactionValidationError` when the metadata is invalid (before `initialTx` is set). Rejects with
   * the underlying error when no adapter is configured, or when the chain check, `beforeTxProcess` (with
   * `abortOnTxError`), `actionFunction` or the tracker start fails; `initialTx.error` is set first.
   */
  executeTxAction: (
    params: {
      actionFunction: () => Promise<ActionTxKey | undefined>;
      params: Omit<InitialTransactionParams, 'actionFunction'>;
      defaultTracker?: TransactionTracker;
      beforeTxProcess?: BeforeTxProcess;
      abortOnTxError?: boolean;
    } & TrackerCallbacks<T>,
  ) => Promise<void>;

  /**
   * Restarts the trackers of all pending transactions in the pool, for example after a page reload. Pending
   * transactions that fail validation are removed from the pool. Call it once per page load: every call starts new
   * trackers, and trackers started here have no `TrackerCallbacks`.
   * @returns A promise that resolves when all trackers have started.
   */
  initializeTransactionsPool: () => Promise<void>;
  /**
   * Merges transactions from a remote backend into the pool (cross-device sync). Invalid transactions are skipped
   * with a warning. Pending remote transactions that are not in the pool are added and tracked. Local pending
   * transactions that are terminal remotely take the remote `status`, `txKey` and `finishedTimestamp` and are marked
   * not pending.
   * @param remoteTxs - Transactions returned by the backend.
   * @returns A promise that resolves when the trackers of the added transactions have started.
   */
  injectExternalPendingTxs: (remoteTxs: T[]) => Promise<void>;
};

/**
 * The pagination state and action of the in-memory history store, as consumed by UI components.
 */
export type TxInMemoryPagination = {
  /** `true` while a history page is loading. */
  isLoading: boolean;
  /** `true` when the last history request failed. */
  isError: boolean;
  /** `true` when the last loaded page reported a next page. */
  hasMore: boolean;
  /** The last loaded page number. */
  currentPage: number;
  /**
   * Loads the page after `currentPage` and merges it into the pool. Does nothing while loading, when `hasMore` is
   * `false`, or without `getHistory`.
   * @param walletAddress - The wallet whose history is loaded.
   */
  fetchNextPage: (walletAddress: string) => Promise<void>;
};

/**
 * The state and actions of the store created by `createTxInMemoryStore`: a paginated remote history merged with the
 * local pool. Nothing in it is persisted.
 *
 * @template T - The application transaction type.
 */
export type ITxInMemoryStore<T extends Transaction> = {
  /** The local and remote transactions, indexed by `txKey`. */
  transactionsPool: TransactionPool<T>;
  /**
   * Runs `reconcileUnsyncedTransactions` (if provided), then loads the first history page and merges it into the
   * pool. Does nothing without `getHistory` or an empty `walletAddress`.
   * @param walletAddress - The wallet whose history is loaded.
   */
  fetchInitial: (walletAddress: string) => Promise<void>;
  /**
   * Merges a local pool into the in-memory pool. Transactions that are `Success` or `Replaced` in memory are kept;
   * pending ones are overwritten only by a terminal transaction or one with more confirmations.
   * @param localPool - The pool of the persistent store, usually from its `subscribe` listener.
   */
  syncWithLocalPool: (localPool: TransactionPool<T>) => void;
} & TxInMemoryPagination;

/**
 * The configuration of `createTxInMemoryStore`.
 *
 * @template T - The application transaction type.
 */
export type ITxInMemoryStoreParameters<T extends Transaction> = {
  /** The initial pool, usually `transactionsPool` of the persistent store. */
  localTransactionsPool: TransactionPool<T>;
  /** Called by `fetchInitial` before the first page is loaded, usually the store's `reconcileUnsyncedTransactions`. */
  reconcileUnsyncedTransactions?: () => Promise<void>;
  /**
   * Called in a microtask with the valid transactions of every loaded page, usually to pass them to the store's
   * `injectExternalPendingTxs`.
   * @param remoteTxs - The transactions of the loaded page.
   */
  onHistoryFetched?: (remoteTxs: T[]) => void;
  /**
   * Loads one page of the remote history of a wallet. Return `null` when there is no history to show (for example,
   * the user is not signed in); throw on errors to set `isError`.
   */
  getHistory?: ({
    page,
    walletAddress,
  }: {
    /**
     * Page number for pagination.
     *
     * @defaultValue `1`
     */
    page?: number;

    /** The wallet whose history is requested. */
    walletAddress: string;
  }) => Promise<{
    /** Array of transactions for the current page. */
    docs: T[];
    /** Total number of transactions matching the query. */
    totalDocs: number;
    /** Total number of available pages. */
    totalPages: number;
    /** Current page number. */
    page: number;
    /** Indicates whether a next page exists. */
    hasNextPage: boolean;
    /** Indicates whether a previous page exists. */
    hasPrevPage: boolean;
  } | null>;
};
