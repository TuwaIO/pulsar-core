[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# IInitializeTxTrackingStore\<T\>

Defined in: [packages/pulsar-core/src/types.ts:337](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L337)

The interface for the base transaction tracking store slice.
It includes the state and actions for managing the transaction lifecycle.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type.

## Properties

### addTxToPool()

> **addTxToPool**: (`tx`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:346](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L346)

Adds a new transaction to the tracking pool and marks it as pending.

#### Parameters

##### tx

`T`

#### Returns

`void`

***

### closeTxTrackedModal()

> **closeTxTrackedModal**: (`txKey?`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:352](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L352)

Closes the tracking modal for a transaction and clears any initial transaction state.

#### Parameters

##### txKey?

`string`

#### Returns

`void`

***

### getLastTxKey()

> **getLastTxKey**: () => `undefined` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:354](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L354)

A selector function to retrieve the key of the last transaction added to the pool.

#### Returns

`undefined` \| `string`

***

### initialTx?

> `optional` **initialTx**: [`InitialTransaction`](../type-aliases/InitialTransaction.md)

Defined in: [packages/pulsar-core/src/types.ts:343](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L343)

The state for a transaction being initiated, used for UI feedback before it's submitted to the chain.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:341](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L341)

The `txKey` of the most recently added transaction.

***

### removeTxFromPool()

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:350](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L350)

Removes a transaction from the tracking pool by its key.

#### Parameters

##### txKey

`string`

#### Returns

`void`

***

### transactionsPool

> **transactionsPool**: [`TransactionPool`](../type-aliases/TransactionPool.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:339](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L339)

A pool of all transactions currently being tracked, indexed by `txKey`.

***

### updateTxParams()

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:348](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L348)

Updates one or more properties of an existing transaction in the pool.

#### Parameters

##### txKey

`string`

##### fields

`UpdatableTransactionFields`

#### Returns

`void`
