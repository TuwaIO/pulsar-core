[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# IInitializeTxTrackingStore\<TR, T, A\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:54](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L54)

The interface for the base transaction tracking store slice.
It includes the state and actions for managing the transaction lifecycle.

## Type Parameters

### TR

`TR`

The type of the tracker identifier.

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

The specific transaction type.

### A

`A`

The return type of the initial action function.

## Properties

### addTxToPool()

> **addTxToPool**: (`tx`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:65](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L65)

Adds a new transaction to the tracking pool and marks it as pending.

#### Parameters

##### tx

[`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

#### Returns

`void`

***

### closeTxTrackedModal()

> **closeTxTrackedModal**: (`txKey?`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:71](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L71)

Closes the tracking modal for a transaction and clears any initial transaction state.

#### Parameters

##### txKey?

`string`

#### Returns

`void`

***

### getLastTxKey()

> **getLastTxKey**: () => `undefined` \| `string`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:73](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L73)

A selector function to retrieve the key of the last transaction added to the pool.

#### Returns

`undefined` \| `string`

***

### initialTx?

> `optional` **initialTx**: [`InitialTransaction`](../type-aliases/InitialTransaction.md)\<`A`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:62](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L62)

The state for a transaction being initiated, used for UI feedback before it's submitted to the chain.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey**: `string`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:60](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L60)

The `txKey` of the most recently added transaction.

***

### onSucceedCallbacks()?

> `optional` **onSucceedCallbacks**: (`tx`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:56](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L56)

A callback function executed when any transaction successfully completes.

#### Parameters

##### tx

`T`

#### Returns

`void` \| `Promise`\<`void`\>

***

### removeTxFromPool()

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:69](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L69)

Removes a transaction from the tracking pool by its key.

#### Parameters

##### txKey

`string`

#### Returns

`void`

***

### transactionsPool

> **transactionsPool**: [`TransactionPool`](../type-aliases/TransactionPool.md)\<`TR`, `T`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:58](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L58)

A pool of all transactions currently being tracked, indexed by `txKey`.

***

### updateTxParams()

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:67](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L67)

Updates one or more properties of an existing transaction in the pool.

#### Parameters

##### txKey

`string`

##### fields

`UpdatableTransactionFields`\<`TR`\>

#### Returns

`void`
