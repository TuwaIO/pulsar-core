# ITxTrackingStore\<T\>

> **ITxTrackingStore**\<`T`\> = [`IInitializeTxTrackingStore`](/packages/pulsar-core/interfaces/IInitializeTxTrackingStore.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:652](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L652)

The state and actions of the store created by `createPulsarStore`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Type Declaration

### executeTxAction

> **executeTxAction**: (`params`) => `Promise`\<`void`\>

Runs a transaction from start to tracking: validates `params`, sets `initialTx`, checks the chain (the EVM adapter
may ask the wallet to switch), runs `beforeTxProcess`, calls `actionFunction`, adds the transaction to the pool
(see `addTxToPool`) and starts its tracker. When `actionFunction` returns `undefined`, `initialTx` is cleared and
nothing is tracked. Also starts `reconcileUnsyncedTransactions` in the background.

A Retry names the action it repeats as `params.params.actionFunction`, as `retryTxAction` of the adapters does:
`beforeTxProcess`, `abortOnTxError` and the callbacks of that call apply again unless this call gives its own. They
are kept in memory for as long as the action lives, and the action does not reach the transaction record.

#### Parameters

##### params

`object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\>

The action, its metadata and the callbacks.

#### Returns

`Promise`\<`void`\>

A promise that resolves once the tracker has started, not when the transaction has finished: it may stay
pending for a long time. Read the state from the store instead of awaiting the result.

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
transactions that fail validation are removed from the pool. A transaction already tracked is not tracked twice, so
it is safe to call this again, as React Strict Mode does. Trackers started here have no `TrackerCallbacks`; `onTxFinished` and `subscribeTxFinished` still run
when they finish a transaction.

#### Returns

`Promise`\<`void`\>

A promise that resolves when all trackers have started.

### injectExternalPendingTxs

> **injectExternalPendingTxs**: (`remoteTxs`) => `Promise`\<`void`\>

Merges transactions from a remote backend into the pool (cross-device sync). Invalid transactions are skipped
with a warning. Pending remote transactions that are not in the pool are added and tracked. Local pending
transactions that are terminal remotely take the remote result and are marked not pending, and a tracker running on
them stops. While a tracker runs, a remote `Failed`, or a remote `Replaced` with no `replacedReason`, is ignored: it may
be a server's time limit, and the chain answers through the tracker. A remote speed-up adds the new record.

#### Parameters

##### remoteTxs

`T`[]

Transactions returned by the backend.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the trackers of the added transactions have started.

### isTxTracked

> **isTxTracked**: (`txKey`) => `boolean`

Whether a tracker of this store is responsible for a transaction. It stops being so when the transaction is removed
from the pool or has a final status, and a tracker that asks stops then.

#### Parameters

##### txKey

`string`

The key of the transaction.

#### Returns

`boolean`

`true` while a tracker is responsible for it.

### subscribeTxFinished

> **subscribeTxFinished**: (`listener`) => () => `void`

Adds a listener of the "transaction finished" event (see `TxFinishedListener`). Listeners live in memory, not in
storage: add them after every page load, for example in a React effect (`useTxFinished` of
`@tuwaio/pulsar-react`). Adding the same function twice registers it once.

#### Parameters

##### listener

[`TxFinishedListener`](/packages/pulsar-core/type-aliases/TxFinishedListener.md)\<`T`\>

Called with the transaction when it finishes.

#### Returns

A function that removes the listener.

() => `void`
