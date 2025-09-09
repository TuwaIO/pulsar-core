[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# IInitializeTxTrackingStore\<TR, T\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:49](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L49)

Defines the interface for the base transaction tracking store slice.
It includes the state and actions for managing transactions.

## Type Parameters

### TR

`TR`

The type of the tracker identifier.

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

The transaction type.

## Properties

### addTxToPool()

> **addTxToPool**: (`tx`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:60](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L60)

Adds a new transaction to the tracking pool.

#### Parameters

##### tx

`T`

#### Returns

`void`

***

### closeTxTrackedModal()

> **closeTxTrackedModal**: (`txKey?`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:66](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L66)

Closes the tracking modal for a specific transaction.

#### Parameters

##### txKey?

`string`

#### Returns

`void`

***

### getLastTxKey()

> **getLastTxKey**: () => `undefined` \| `string`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:68](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L68)

Returns the key of the last transaction that was added to the pool.

#### Returns

`undefined` \| `string`

***

### initialTx?

> `optional` **initialTx**: [`InitialTransaction`](../type-aliases/InitialTransaction.md)

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:57](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L57)

The state of a transaction that is currently being initiated but not yet submitted.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey**: `string`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:55](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L55)

The key of the most recently added transaction.

***

### onSucceedCallbacks()?

> `optional` **onSucceedCallbacks**: (`tx`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:51](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L51)

An optional callback function to be executed when a transaction successfully completes.

#### Parameters

##### tx

`T`

#### Returns

`void` \| `Promise`\<`void`\>

***

### removeTxFromPool()

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:64](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L64)

Removes a transaction from the tracking pool using its key.

#### Parameters

##### txKey

`string`

#### Returns

`void`

***

### transactionsPool

> **transactionsPool**: [`TransactionPool`](../type-aliases/TransactionPool.md)\<`TR`, `T`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:53](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L53)

A pool of all transactions currently being tracked, indexed by their `txKey`.

***

### updateTxParams()

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:62](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L62)

Updates one or more parameters of an existing transaction in the pool.

#### Parameters

##### txKey

`string`

##### fields

`UpdatableTransactionFields`\<`TR`\>

#### Returns

`void`
