[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# IInitializeTxTrackingStore\<T\>

Defined in: [packages/pulsar-core/src/types.ts:377](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L377)

The interface for the base transaction tracking store slice.
It includes the state and actions for managing the transaction lifecycle.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type.

## Properties

### addTxToPool()

> **addTxToPool**: (`tx`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:388](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L388)

Adds a new transaction to the tracking pool and marks it as pending.

#### Parameters

##### tx

`T`

The transaction object to add.

#### Returns

`void`

***

### closeTxTrackedModal()

> **closeTxTrackedModal**: (`txKey?`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:404](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L404)

Closes the tracking modal for a transaction and clears any initial transaction state.

#### Parameters

##### txKey?

`string`

The optional key of the transaction modal to close.

#### Returns

`void`

***

### getLastTxKey()

> **getLastTxKey**: () => `string` \| `undefined`

Defined in: [packages/pulsar-core/src/types.ts:409](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L409)

A selector function to retrieve the key of the last transaction added to the pool.

#### Returns

`string` \| `undefined`

The key of the last added transaction, or undefined if none exists.

***

### initialTx?

> `optional` **initialTx**: [`InitialTransaction`](../type-aliases/InitialTransaction.md)

Defined in: [packages/pulsar-core/src/types.ts:383](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L383)

The state for a transaction being initiated, used for verify feedback before it's submitted to the chain.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:381](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L381)

The `txKey` of the most recently added transaction.

***

### removeTxFromPool()

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:399](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L399)

Removes a transaction from the tracking pool by its key.

#### Parameters

##### txKey

`string`

The key of the transaction to remove.

#### Returns

`void`

***

### transactionsPool

> **transactionsPool**: [`TransactionPool`](../type-aliases/TransactionPool.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:379](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L379)

A pool of all transactions currently being tracked, indexed by `txKey`.

***

### updateTxParams()

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:394](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L394)

Updates one or more properties of an existing transaction in the pool.

#### Parameters

##### txKey

`string`

The key of the transaction to update.

##### fields

[`UpdatableTransactionFields`](../type-aliases/UpdatableTransactionFields.md)

The partial object containing the fields to update.

#### Returns

`void`
