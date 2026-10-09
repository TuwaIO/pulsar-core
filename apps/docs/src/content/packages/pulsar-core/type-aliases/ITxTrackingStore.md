# ITxTrackingStore\<T\>

> **ITxTrackingStore**\<`T`\> = [`IInitializeTxTrackingStore`](/packages/pulsar-core/interfaces/IInitializeTxTrackingStore.md)\<`T`\> & `object`

Defined in: [types.ts:598](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L598)

The state and actions of the store created by `createPulsarStore`.

## Type Declaration

### executeTxAction

> **executeTxAction**: (`params`) => `Promise`\<`void`\>

Runs a transaction from start to tracking: validates `params`, sets `initialTx`, checks the chain (the EVM adapter
may ask the wallet to switch), runs `beforeTxProcess`, calls `actionFunction`, adds the transaction to the pool
(see `addTxToPool`) and starts its tracker. When `actionFunction` returns `undefined`, `initialTx` is cleared and
nothing is tracked. Also starts `reconcileUnsyncedTransactions` in the background.

#### Parameters

##### params

`object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\>

The action, its metadata and the callbacks.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the adapter's `checkAndInitializeTrackerInStore` resolves: once polling has
started for polling trackers (Solana, Safe, ERC-4337, Gelato), but only when tracking has finished for standard
EVM transactions (`TransactionTracker.Ethereum`). Read the state from the store instead of awaiting the result.

#### Throws

`PulsarTransactionValidationError` when the metadata is invalid (before `initialTx` is set). Rejects with
the underlying error when no adapter is configured, or when the chain check, `beforeTxProcess` (with
`abortOnTxError`), `actionFunction` or the tracker start fails; `initialTx.error` is set first.

### getAdapter

> **getAdapter**: () => [`TxAdapter`](/packages/pulsar-core/type-aliases/TxAdapter.md)\<`T`\> \| [`TxAdapter`](/packages/pulsar-core/type-aliases/TxAdapter.md)\<`T`\>[]

Returns the adapter configuration passed to `createPulsarStore`.

#### Returns

[`TxAdapter`](/packages/pulsar-core/type-aliases/TxAdapter.md)\<`T`\> \| [`TxAdapter`](/packages/pulsar-core/type-aliases/TxAdapter.md)\<`T`\>[]

The adapter, or the array of adapters.

### initializeTransactionsPool

> **initializeTransactionsPool**: () => `Promise`\<`void`\>

Restarts the trackers of all pending transactions in the pool, for example after a page reload. Pending
transactions that fail validation are removed from the pool. Call it once per page load: every call starts new
trackers, and trackers started here have no `TrackerCallbacks`.

#### Returns

`Promise`\<`void`\>

A promise that resolves when all trackers have started.

### injectExternalPendingTxs

> **injectExternalPendingTxs**: (`remoteTxs`) => `Promise`\<`void`\>

Merges transactions from a remote backend into the pool (cross-device sync). Invalid transactions are skipped
with a warning. Pending remote transactions that are not in the pool are added and tracked. Local pending
transactions that are terminal remotely take the remote `status`, `txKey` and `finishedTimestamp` and are marked
not pending.

#### Parameters

##### remoteTxs

`T`[]

Transactions returned by the backend.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the trackers of the added transactions have started.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.
