[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# IInitializeTxTrackingStore\<TR, T\>

> **IInitializeTxTrackingStore**\<`TR`, `T`\> = `object`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:47](https://github.com/TuwaIO/pulsar-core/blob/4e6a98991bdba757946ff4584c5a9e22ecc297f5/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L47)

Defines the interface for the base transaction tracking store slice.
It includes the state and actions for managing transactions.

## Type Parameters

### TR

`TR`

The type of the tracker identifier.

### T

`T` *extends* [`Transaction`](Transaction.md)\<`TR`\>

The transaction type.

## Properties

### addTxToPool()

> **addTxToPool**: (`{ tx }`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:58](https://github.com/TuwaIO/pulsar-core/blob/4e6a98991bdba757946ff4584c5a9e22ecc297f5/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L58)

Adds a new transaction to the tracking pool.

#### Parameters

##### \{ tx \}

###### tx

`T`

#### Returns

`void`

***

### closeTxTrackedModal()

> **closeTxTrackedModal**: (`txKey?`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:64](https://github.com/TuwaIO/pulsar-core/blob/4e6a98991bdba757946ff4584c5a9e22ecc297f5/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L64)

Closes the tracking modal for a specific transaction.

#### Parameters

##### txKey?

`string`

#### Returns

`void`

***

### getLastTxKey()

> **getLastTxKey**: () => `string` \| `undefined`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:66](https://github.com/TuwaIO/pulsar-core/blob/4e6a98991bdba757946ff4584c5a9e22ecc297f5/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L66)

Returns the key of the last transaction that was added to the pool.

#### Returns

`string` \| `undefined`

***

### initialTx?

> `optional` **initialTx**: [`InitialTransaction`](InitialTransaction.md)

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:55](https://github.com/TuwaIO/pulsar-core/blob/4e6a98991bdba757946ff4584c5a9e22ecc297f5/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L55)

The state of a transaction that is currently being initiated but not yet submitted.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey**: `string`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:53](https://github.com/TuwaIO/pulsar-core/blob/4e6a98991bdba757946ff4584c5a9e22ecc297f5/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L53)

The key of the most recently added transaction.

***

### onSucceedCallbacks()?

> `optional` **onSucceedCallbacks**: (`tx`) => `Promise`\<`void`\> \| `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:49](https://github.com/TuwaIO/pulsar-core/blob/4e6a98991bdba757946ff4584c5a9e22ecc297f5/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L49)

An optional callback function to be executed when a transaction successfully completes.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`void`\> \| `void`

***

### removeTxFromPool()

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:62](https://github.com/TuwaIO/pulsar-core/blob/4e6a98991bdba757946ff4584c5a9e22ecc297f5/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L62)

Removes a transaction from the tracking pool using its key.

#### Parameters

##### txKey

`string`

#### Returns

`void`

***

### transactionsPool

> **transactionsPool**: [`TransactionPool`](TransactionPool.md)\<`TR`, `T`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:51](https://github.com/TuwaIO/pulsar-core/blob/4e6a98991bdba757946ff4584c5a9e22ecc297f5/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L51)

A pool of all transactions currently being tracked, indexed by their `txKey`.

***

### updateTxParams()

> **updateTxParams**: (`fields`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:60](https://github.com/TuwaIO/pulsar-core/blob/4e6a98991bdba757946ff4584c5a9e22ecc297f5/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L60)

Updates one or more parameters of an existing transaction in the pool.

#### Parameters

##### fields

`UpdatedParamsFields`\<`TR`\>

#### Returns

`void`
