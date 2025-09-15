[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# IInitializeTxTrackingStore\<TR, T, A\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:52](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L52)

Defines the interface for the base transaction tracking store slice.
It includes the state and actions for managing transactions.

## Type Parameters

### TR

`TR`

The type of the tracker identifier.

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

The transaction type.

### A

`A`

## Properties

### addTxToPool()

> **addTxToPool**: (`tx`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:63](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L63)

Adds a new transaction to the tracking pool.

#### Parameters

##### tx

[`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

#### Returns

`void`

***

### closeTxTrackedModal()

> **closeTxTrackedModal**: (`txKey?`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:69](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L69)

Closes the tracking modal for a specific transaction.

#### Parameters

##### txKey?

`string`

#### Returns

`void`

***

### getLastTxKey()

> **getLastTxKey**: () => `undefined` \| `string`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:71](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L71)

Returns the key of the last transaction that was added to the pool.

#### Returns

`undefined` \| `string`

***

### initialTx?

> `optional` **initialTx**: [`InitialTransaction`](../type-aliases/InitialTransaction.md)\<`A`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:60](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L60)

The state of a transaction that is currently being initiated but not yet submitted.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey**: `string`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:58](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L58)

The key of the most recently added transaction.

***

### onSucceedCallbacks()?

> `optional` **onSucceedCallbacks**: (`tx`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:54](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L54)

An optional callback function to be executed when a transaction successfully completes.

#### Parameters

##### tx

`T`

#### Returns

`void` \| `Promise`\<`void`\>

***

### removeTxFromPool()

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:67](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L67)

Removes a transaction from the tracking pool using its key.

#### Parameters

##### txKey

`string`

#### Returns

`void`

***

### transactionsPool

> **transactionsPool**: [`TransactionPool`](../type-aliases/TransactionPool.md)\<`TR`, `T`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:56](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L56)

A pool of all transactions currently being tracked, indexed by their `txKey`.

***

### updateTxParams()

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:65](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L65)

Updates one or more parameters of an existing transaction in the pool.

#### Parameters

##### txKey

`string`

##### fields

`UpdatableTransactionFields`\<`TR`\>

#### Returns

`void`
