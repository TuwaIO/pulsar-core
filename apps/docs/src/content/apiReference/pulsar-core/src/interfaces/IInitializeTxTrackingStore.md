[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# IInitializeTxTrackingStore\<T\>

Defined in: [packages/pulsar-core/src/types.ts:358](https://github.com/TuwaIO/pulsar-core/blob/4b67ec90377e30bc90519177a553a449e097fe32/packages/pulsar-core/src/types.ts#L358)

The interface for the base transaction tracking store slice.
It includes the state and actions for managing the transaction lifecycle.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type.

## Properties

### addTxToPool()

> **addTxToPool**: (`tx`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:370](https://github.com/TuwaIO/pulsar-core/blob/4b67ec90377e30bc90519177a553a449e097fe32/packages/pulsar-core/src/types.ts#L370)

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

Defined in: [packages/pulsar-core/src/types.ts:386](https://github.com/TuwaIO/pulsar-core/blob/4b67ec90377e30bc90519177a553a449e097fe32/packages/pulsar-core/src/types.ts#L386)

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

Defined in: [packages/pulsar-core/src/types.ts:391](https://github.com/TuwaIO/pulsar-core/blob/4b67ec90377e30bc90519177a553a449e097fe32/packages/pulsar-core/src/types.ts#L391)

A selector function to retrieve the key of the last transaction added to the pool.

#### Returns

`undefined` \| `string`

The key of the last added transaction, or undefined if none exists.

***

### initialTx?

> `optional` **initialTx**: [`InitialTransaction`](../type-aliases/InitialTransaction.md)

Defined in: [packages/pulsar-core/src/types.ts:364](https://github.com/TuwaIO/pulsar-core/blob/4b67ec90377e30bc90519177a553a449e097fe32/packages/pulsar-core/src/types.ts#L364)

The state for a transaction being initiated, used for UI feedback before it's submitted to the chain.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:362](https://github.com/TuwaIO/pulsar-core/blob/4b67ec90377e30bc90519177a553a449e097fe32/packages/pulsar-core/src/types.ts#L362)

The `txKey` of the most recently added transaction.

***

### removeTxFromPool()

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:381](https://github.com/TuwaIO/pulsar-core/blob/4b67ec90377e30bc90519177a553a449e097fe32/packages/pulsar-core/src/types.ts#L381)

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

Defined in: [packages/pulsar-core/src/types.ts:360](https://github.com/TuwaIO/pulsar-core/blob/4b67ec90377e30bc90519177a553a449e097fe32/packages/pulsar-core/src/types.ts#L360)

A pool of all transactions currently being tracked, indexed by `txKey`.

***

### updateTxParams()

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:376](https://github.com/TuwaIO/pulsar-core/blob/4b67ec90377e30bc90519177a553a449e097fe32/packages/pulsar-core/src/types.ts#L376)

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
