[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# IInitializeTxTrackingStore\<T\>

Defined in: [packages/pulsar-core/src/types.ts:393](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L393)

The interface for the base transaction tracking store slice.
It includes the state and actions for managing the transaction lifecycle.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type.

## Properties

### addTxToPool

> **addTxToPool**: (`tx`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:404](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L404)

Adds a new transaction to the tracking pool and marks it as pending.

#### Parameters

##### tx

`T`

The transaction object to add.

#### Returns

`Promise`\<`void`\>

***

### closeTxTrackedModal

> **closeTxTrackedModal**: (`txKey?`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:420](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L420)

Closes the tracking modal for a transaction and clears any initial transaction state.

#### Parameters

##### txKey?

`string`

The optional key of the transaction modal to close.

#### Returns

`void`

***

### getLastTxKey

> **getLastTxKey**: () => `string` \| `undefined`

Defined in: [packages/pulsar-core/src/types.ts:425](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L425)

A selector function to retrieve the key of the last transaction added to the pool.

#### Returns

`string` \| `undefined`

The key of the last added transaction, or undefined if none exists.

***

### initialTx?

> `optional` **initialTx?**: [`InitialTransaction`](../type-aliases/InitialTransaction.md)

Defined in: [packages/pulsar-core/src/types.ts:399](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L399)

The state for a transaction being initiated, used for verify feedback before it's submitted to the chain.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:397](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L397)

The `txKey` of the most recently added transaction.

***

### removeTxFromPool

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:415](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L415)

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

Defined in: [packages/pulsar-core/src/types.ts:395](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L395)

A pool of all transactions currently being tracked, indexed by `txKey`.

***

### updateTxParams

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:410](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L410)

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
