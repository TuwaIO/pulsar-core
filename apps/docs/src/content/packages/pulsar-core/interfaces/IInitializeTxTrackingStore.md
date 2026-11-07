# IInitializeTxTrackingStore\<T\>

Defined in: [packages/pulsar-core/src/types.ts:579](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L579)

The state and actions of the core store slice created by `initializeTxTrackingStore`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Properties

### addTxToPool

> **addTxToPool**: (`tx`, `options?`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:601](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L601)

Validates a transaction and adds it to the pool with `pending: true`. When the pool already holds
`maxTransactions` transactions, the oldest finished ones are evicted (pending ones never are). If `onRemoteCreate` is configured, the transaction gets
`syncStatus: 'pending-sync'`, its key is listed in `unsyncedTxKeys`, and `onRemoteCreate` runs in the background
(see `SyncCallbacks`). Does not start a tracker.

#### Parameters

##### tx

`T`

The transaction to add.

##### options?

The options.

###### withoutSync?

`boolean`

Keeps it from `onRemoteCreate`, for a record the backend has no row to continue from.

#### Returns

`Promise`\<`void`\>

A promise that resolves once the transaction is in the pool, without waiting for `onRemoteCreate`.

#### Throws

`PulsarTransactionValidationError` synchronously, before anything is written, when the title, description
or payload is invalid.

***

### closeTxTrackedModal

> **closeTxTrackedModal**: (`txKey?`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:625](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L625)

Sets `isTrackedModalOpen: false` on a transaction and always clears `initialTx`.

#### Parameters

##### txKey?

`string`

The key of the transaction whose modal is closed, if any.

#### Returns

`void`

***

### getLastTxKey

> **getLastTxKey**: () => `string` \| `undefined`

Defined in: [packages/pulsar-core/src/types.ts:630](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L630)

Returns `lastAddedTxKey`.

#### Returns

`string` \| `undefined`

The key of the transaction added last, or `undefined`.

***

### initialTx?

> `optional` **initialTx?**: [`InitialTransaction`](/packages/pulsar-core/type-aliases/InitialTransaction.md)

Defined in: [packages/pulsar-core/src/types.ts:588](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L588)

The transaction `executeTxAction` is processing, before it is added to the pool. Not persisted by
`createPulsarStore`: after a reload it is `undefined`.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:583](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L583)

The `txKey` of the transaction added last.

***

### reconcileUnsyncedTransactions

> **reconcileUnsyncedTransactions**: () => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:644](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L644)

Calls `onRemoteCreate` again for every key in `unsyncedTxKeys`, one after another, skipping keys whose call is still
in flight. Successful transactions are marked `'synced'` and removed from the list; failures are logged and stay
listed; keys of transactions no longer in the pool are removed. Does nothing without `onRemoteCreate` or while a
previous run is in progress. Runs at the start of every `executeTxAction`, when an
unsynced transaction reaches a terminal status, and when `createTxInMemoryStore` loads the first history page.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the run is finished. It does not reject.

***

### removeTxFromPool

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:620](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L620)

Deletes a transaction from the pool and stops its tracker, for trackers that read `isTxTracked`. Finishing never
deletes a transaction: only this does, and the retention limits of the pool.

#### Parameters

##### txKey

`string`

The key of the transaction.

#### Returns

`void`

***

### transactionsPool

> **transactionsPool**: [`TransactionPool`](/packages/pulsar-core/type-aliases/TransactionPool.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:581](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L581)

Every tracked transaction, indexed by `txKey`. Persisted to `localStorage` by `createPulsarStore`.

***

### unsyncedTxKeys?

> `optional` **unsyncedTxKeys?**: `Record`\<`string`, `boolean`\>

Defined in: [packages/pulsar-core/src/types.ts:635](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L635)

Keys of transactions that `onRemoteCreate` has not confirmed yet: in flight, failed, or interrupted by a reload.
`reconcileUnsyncedTransactions` retries them. Persisted to `localStorage`.

***

### updateTxParams

> **updateTxParams**: (`txKey`, `fields`) => `T` \| `undefined` \| `void`

Defined in: [packages/pulsar-core/src/types.ts:614](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L614)

Merges fields into a transaction of the pool; does nothing if the key is unknown. When `fields.status` is terminal
and the transaction is in `unsyncedTxKeys`, it starts `reconcileUnsyncedTransactions` in the background. When it
moves the transaction from a non-final to a final status, it calls the "transaction finished" listeners (see
`TxFinishedListener`).

#### Parameters

##### txKey

`string`

The key of the transaction.

##### fields

[`UpdatableTransactionFields`](/packages/pulsar-core/type-aliases/UpdatableTransactionFields.md)

The fields to merge.
Once a transaction has a final status, its result fields (`status`, `pending`, `isError`, `error`, `finishedTimestamp`,
`replacedTxHash`, `replacedReason`) are kept against a later write, as a late writer only lost sight of it. The one
exception is `Success` or `Replaced` over a `Failed`: the chain corrects what a time limit may have said.

#### Returns

`T` \| `undefined` \| `void`

The transaction as the store holds it after the write, or `undefined` when it is not in the pool.
