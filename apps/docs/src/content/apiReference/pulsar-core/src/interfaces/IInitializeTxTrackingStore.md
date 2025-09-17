[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# IInitializeTxTrackingStore\<T\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:48](https://github.com/TuwaIO/pulsar-core/blob/588f0298eed13d576622f00b75515bcca31625e2/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L48)

The interface for the base transaction tracking store slice.
It includes the state and actions for managing the transaction lifecycle.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type.

## Properties

### addTxToPool()

> **addTxToPool**: (`tx`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:59](https://github.com/TuwaIO/pulsar-core/blob/588f0298eed13d576622f00b75515bcca31625e2/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L59)

Adds a new transaction to the tracking pool and marks it as pending.

#### Parameters

##### tx

`T`

#### Returns

`void`

***

### closeTxTrackedModal()

> **closeTxTrackedModal**: (`txKey?`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:65](https://github.com/TuwaIO/pulsar-core/blob/588f0298eed13d576622f00b75515bcca31625e2/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L65)

Closes the tracking modal for a transaction and clears any initial transaction state.

#### Parameters

##### txKey?

`string`

#### Returns

`void`

***

### getLastTxKey()

> **getLastTxKey**: () => `undefined` \| `string`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:67](https://github.com/TuwaIO/pulsar-core/blob/588f0298eed13d576622f00b75515bcca31625e2/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L67)

A selector function to retrieve the key of the last transaction added to the pool.

#### Returns

`undefined` \| `string`

***

### initialTx?

> `optional` **initialTx**: [`InitialTransaction`](../type-aliases/InitialTransaction.md)

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:56](https://github.com/TuwaIO/pulsar-core/blob/588f0298eed13d576622f00b75515bcca31625e2/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L56)

The state for a transaction being initiated, used for UI feedback before it's submitted to the chain.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey**: `string`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:54](https://github.com/TuwaIO/pulsar-core/blob/588f0298eed13d576622f00b75515bcca31625e2/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L54)

The `txKey` of the most recently added transaction.

***

### onSucceedCallbacks()?

> `optional` **onSucceedCallbacks**: (`tx`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:50](https://github.com/TuwaIO/pulsar-core/blob/588f0298eed13d576622f00b75515bcca31625e2/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L50)

A callback function executed when any transaction successfully completes.

#### Parameters

##### tx

`T`

#### Returns

`void` \| `Promise`\<`void`\>

***

### removeTxFromPool()

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:63](https://github.com/TuwaIO/pulsar-core/blob/588f0298eed13d576622f00b75515bcca31625e2/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L63)

Removes a transaction from the tracking pool by its key.

#### Parameters

##### txKey

`string`

#### Returns

`void`

***

### transactionsPool

> **transactionsPool**: [`TransactionPool`](../type-aliases/TransactionPool.md)\<`T`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:52](https://github.com/TuwaIO/pulsar-core/blob/588f0298eed13d576622f00b75515bcca31625e2/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L52)

A pool of all transactions currently being tracked, indexed by `txKey`.

***

### updateTxParams()

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:61](https://github.com/TuwaIO/pulsar-core/blob/588f0298eed13d576622f00b75515bcca31625e2/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L61)

Updates one or more properties of an existing transaction in the pool.

#### Parameters

##### txKey

`string`

##### fields

`UpdatableTransactionFields`

#### Returns

`void`
