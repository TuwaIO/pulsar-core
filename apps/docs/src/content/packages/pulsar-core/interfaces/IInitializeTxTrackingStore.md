# IInitializeTxTrackingStore\<T\>

Defined in: [types.ts:534](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L534)

The state and actions of the core store slice created by `initializeTxTrackingStore`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Properties

### addTxToPool

> **addTxToPool**: (`tx`) => `Promise`\<`void`\>

Defined in: [types.ts:554](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L554)

Validates a transaction and adds it to the pool with `pending: true`. When the pool already holds
`maxTransactions` transactions, the oldest one is evicted. If `onRemoteCreate` is configured, the transaction gets
`syncStatus: 'pending-sync'`, its key is listed in `unsyncedTxKeys`, and `onRemoteCreate` runs in the background
(see `SyncCallbacks`). Does not start a tracker.

#### Parameters

##### tx

`T`

The transaction to add.

#### Returns

`Promise`\<`void`\>

A promise that resolves once the transaction is in the pool, without waiting for `onRemoteCreate`.

#### Throws

`PulsarTransactionValidationError` synchronously, before anything is written, when the title, description
or payload is invalid.

***

### closeTxTrackedModal

> **closeTxTrackedModal**: (`txKey?`) => `void`

Defined in: [types.ts:571](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L571)

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

Defined in: [types.ts:576](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L576)

Returns `lastAddedTxKey`.

#### Returns

`string` \| `undefined`

The key of the transaction added last, or `undefined`.

***

### initialTx?

> `optional` **initialTx?**: [`InitialTransaction`](/packages/pulsar-core/type-aliases/InitialTransaction.md)

Defined in: [types.ts:543](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L543)

The transaction `executeTxAction` is processing, before it is added to the pool. Not persisted by
`createPulsarStore`: after a reload it is `undefined`.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey?**: `string`

Defined in: [types.ts:538](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L538)

The `txKey` of the transaction added last.

***

### reconcileUnsyncedTransactions

> **reconcileUnsyncedTransactions**: () => `Promise`\<`void`\>

Defined in: [types.ts:590](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L590)

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

Defined in: [types.ts:566](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L566)

Removes a transaction from the pool. Does not stop its tracker.

#### Parameters

##### txKey

`string`

The key of the transaction.

#### Returns

`void`

***

### transactionsPool

> **transactionsPool**: [`TransactionPool`](/packages/pulsar-core/type-aliases/TransactionPool.md)\<`T`\>

Defined in: [types.ts:536](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L536)

Every tracked transaction, indexed by `txKey`. Persisted to `localStorage` by `createPulsarStore`.

***

### unsyncedTxKeys?

> `optional` **unsyncedTxKeys?**: `Record`\<`string`, `boolean`\>

Defined in: [types.ts:581](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L581)

Keys of transactions that `onRemoteCreate` has not confirmed yet: in flight, failed, or interrupted by a reload.
`reconcileUnsyncedTransactions` retries them. Persisted to `localStorage`.

***

### updateTxParams

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [types.ts:561](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L561)

Merges fields into a transaction of the pool; does nothing if the key is unknown. When `fields.status` is terminal
and the transaction is in `unsyncedTxKeys`, it starts `reconcileUnsyncedTransactions` in the background.

#### Parameters

##### txKey

`string`

The key of the transaction.

##### fields

[`UpdatableTransactionFields`](/packages/pulsar-core/type-aliases/UpdatableTransactionFields.md)

The fields to merge.

#### Returns

`void`
