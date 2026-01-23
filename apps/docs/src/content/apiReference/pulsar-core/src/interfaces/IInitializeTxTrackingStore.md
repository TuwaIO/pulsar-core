[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# IInitializeTxTrackingStore\<T\>

Defined in: [packages/pulsar-core/src/types.ts:365](https://github.com/TuwaIO/pulsar-core/blob/e56d20196785cbd4bdaac53127d472f3ae8dfd10/packages/pulsar-core/src/types.ts#L365)

The interface for the base transaction tracking store slice.
It includes the state and actions for managing the transaction lifecycle.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type.

## Properties

### addTxToPool()

> **addTxToPool**: (`tx`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:377](https://github.com/TuwaIO/pulsar-core/blob/e56d20196785cbd4bdaac53127d472f3ae8dfd10/packages/pulsar-core/src/types.ts#L377)

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

Defined in: [packages/pulsar-core/src/types.ts:393](https://github.com/TuwaIO/pulsar-core/blob/e56d20196785cbd4bdaac53127d472f3ae8dfd10/packages/pulsar-core/src/types.ts#L393)

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

Defined in: [packages/pulsar-core/src/types.ts:398](https://github.com/TuwaIO/pulsar-core/blob/e56d20196785cbd4bdaac53127d472f3ae8dfd10/packages/pulsar-core/src/types.ts#L398)

A selector function to retrieve the key of the last transaction added to the pool.

#### Returns

`string` \| `undefined`

The key of the last added transaction, or undefined if none exists.

***

### initialTx?

> `optional` **initialTx**: [`InitialTransaction`](../type-aliases/InitialTransaction.md)

Defined in: [packages/pulsar-core/src/types.ts:371](https://github.com/TuwaIO/pulsar-core/blob/e56d20196785cbd4bdaac53127d472f3ae8dfd10/packages/pulsar-core/src/types.ts#L371)

The state for a transaction being initiated, used for UI feedback before it's submitted to the chain.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:369](https://github.com/TuwaIO/pulsar-core/blob/e56d20196785cbd4bdaac53127d472f3ae8dfd10/packages/pulsar-core/src/types.ts#L369)

The `txKey` of the most recently added transaction.

***

### removeTxFromPool()

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:388](https://github.com/TuwaIO/pulsar-core/blob/e56d20196785cbd4bdaac53127d472f3ae8dfd10/packages/pulsar-core/src/types.ts#L388)

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

Defined in: [packages/pulsar-core/src/types.ts:367](https://github.com/TuwaIO/pulsar-core/blob/e56d20196785cbd4bdaac53127d472f3ae8dfd10/packages/pulsar-core/src/types.ts#L367)

A pool of all transactions currently being tracked, indexed by `txKey`.

***

### updateTxParams()

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:383](https://github.com/TuwaIO/pulsar-core/blob/e56d20196785cbd4bdaac53127d472f3ae8dfd10/packages/pulsar-core/src/types.ts#L383)

Updates one or more properties of an existing transaction in the pool.

#### Parameters

##### txKey

`string`

The key of the transaction to update.

##### fields

`UpdatableTransactionFields`

The partial object containing the fields to update.

#### Returns

`void`
