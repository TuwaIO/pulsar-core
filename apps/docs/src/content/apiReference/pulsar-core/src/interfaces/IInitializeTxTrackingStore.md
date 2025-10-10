[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# IInitializeTxTrackingStore\<T\>

Defined in: [packages/pulsar-core/src/types.ts:336](https://github.com/TuwaIO/pulsar-core/blob/218599a38fbb7ca6ddbf6d3718f1f87883cde391/packages/pulsar-core/src/types.ts#L336)

The interface for the base transaction tracking store slice.
It includes the state and actions for managing the transaction lifecycle.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type.

## Properties

### addTxToPool()

> **addTxToPool**: (`tx`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:348](https://github.com/TuwaIO/pulsar-core/blob/218599a38fbb7ca6ddbf6d3718f1f87883cde391/packages/pulsar-core/src/types.ts#L348)

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

Defined in: [packages/pulsar-core/src/types.ts:364](https://github.com/TuwaIO/pulsar-core/blob/218599a38fbb7ca6ddbf6d3718f1f87883cde391/packages/pulsar-core/src/types.ts#L364)

Closes the tracking modal for a transaction and clears any initial transaction state.

#### Parameters

##### txKey?

`string`

The optional key of the transaction modal to close.

#### Returns

`void`

***

### getLastTxKey()

> **getLastTxKey**: () => `undefined` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:369](https://github.com/TuwaIO/pulsar-core/blob/218599a38fbb7ca6ddbf6d3718f1f87883cde391/packages/pulsar-core/src/types.ts#L369)

A selector function to retrieve the key of the last transaction added to the pool.

#### Returns

`undefined` \| `string`

The key of the last added transaction, or undefined if none exists.

***

### initialTx?

> `optional` **initialTx**: [`InitialTransaction`](../type-aliases/InitialTransaction.md)

Defined in: [packages/pulsar-core/src/types.ts:342](https://github.com/TuwaIO/pulsar-core/blob/218599a38fbb7ca6ddbf6d3718f1f87883cde391/packages/pulsar-core/src/types.ts#L342)

The state for a transaction being initiated, used for UI feedback before it's submitted to the chain.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:340](https://github.com/TuwaIO/pulsar-core/blob/218599a38fbb7ca6ddbf6d3718f1f87883cde391/packages/pulsar-core/src/types.ts#L340)

The `txKey` of the most recently added transaction.

***

### removeTxFromPool()

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:359](https://github.com/TuwaIO/pulsar-core/blob/218599a38fbb7ca6ddbf6d3718f1f87883cde391/packages/pulsar-core/src/types.ts#L359)

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

Defined in: [packages/pulsar-core/src/types.ts:338](https://github.com/TuwaIO/pulsar-core/blob/218599a38fbb7ca6ddbf6d3718f1f87883cde391/packages/pulsar-core/src/types.ts#L338)

A pool of all transactions currently being tracked, indexed by `txKey`.

***

### updateTxParams()

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:354](https://github.com/TuwaIO/pulsar-core/blob/218599a38fbb7ca6ddbf6d3718f1f87883cde391/packages/pulsar-core/src/types.ts#L354)

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
