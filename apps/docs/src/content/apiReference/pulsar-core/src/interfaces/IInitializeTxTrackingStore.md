[**API Reference.**](../../../README.md)

***

# IInitializeTxTrackingStore\<T\>

Defined in: [packages/pulsar-core/src/types.ts:394](https://github.com/TuwaIO/pulsar-core/blob/c009e922cecf941d1fcdf2f75b06344c7f83e79e/packages/pulsar-core/src/types.ts#L394)

The interface for the base transaction tracking store slice.
It includes the state and actions for managing the transaction lifecycle.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type.

## Properties

### addTxToPool

> **addTxToPool**: (`tx`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:405](https://github.com/TuwaIO/pulsar-core/blob/c009e922cecf941d1fcdf2f75b06344c7f83e79e/packages/pulsar-core/src/types.ts#L405)

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

Defined in: [packages/pulsar-core/src/types.ts:421](https://github.com/TuwaIO/pulsar-core/blob/c009e922cecf941d1fcdf2f75b06344c7f83e79e/packages/pulsar-core/src/types.ts#L421)

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

Defined in: [packages/pulsar-core/src/types.ts:426](https://github.com/TuwaIO/pulsar-core/blob/c009e922cecf941d1fcdf2f75b06344c7f83e79e/packages/pulsar-core/src/types.ts#L426)

A selector function to retrieve the key of the last transaction added to the pool.

#### Returns

`string` \| `undefined`

The key of the last added transaction, or undefined if none exists.

***

### initialTx?

> `optional` **initialTx?**: [`InitialTransaction`](../type-aliases/InitialTransaction.md)

Defined in: [packages/pulsar-core/src/types.ts:400](https://github.com/TuwaIO/pulsar-core/blob/c009e922cecf941d1fcdf2f75b06344c7f83e79e/packages/pulsar-core/src/types.ts#L400)

The state for a transaction being initiated, used for verify feedback before it's submitted to the chain.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:398](https://github.com/TuwaIO/pulsar-core/blob/c009e922cecf941d1fcdf2f75b06344c7f83e79e/packages/pulsar-core/src/types.ts#L398)

The `txKey` of the most recently added transaction.

***

### removeTxFromPool

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:416](https://github.com/TuwaIO/pulsar-core/blob/c009e922cecf941d1fcdf2f75b06344c7f83e79e/packages/pulsar-core/src/types.ts#L416)

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

Defined in: [packages/pulsar-core/src/types.ts:396](https://github.com/TuwaIO/pulsar-core/blob/c009e922cecf941d1fcdf2f75b06344c7f83e79e/packages/pulsar-core/src/types.ts#L396)

A pool of all transactions currently being tracked, indexed by `txKey`.

***

### updateTxParams

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:411](https://github.com/TuwaIO/pulsar-core/blob/c009e922cecf941d1fcdf2f75b06344c7f83e79e/packages/pulsar-core/src/types.ts#L411)

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
