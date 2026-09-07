[**API Reference.**](../../../README.md)

***

# IInitializeTxTrackingStore\<T\>

Defined in: [packages/pulsar-core/src/types.ts:412](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L412)

The interface for the base transaction tracking store slice.
It includes the state and actions for managing the transaction lifecycle.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type.

## Properties

### addTxToPool

> **addTxToPool**: (`tx`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:423](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L423)

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

Defined in: [packages/pulsar-core/src/types.ts:439](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L439)

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

Defined in: [packages/pulsar-core/src/types.ts:444](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L444)

A selector function to retrieve the key of the last transaction added to the pool.

#### Returns

`string` \| `undefined`

The key of the last added transaction, or undefined if none exists.

***

### initialTx?

> `optional` **initialTx?**: [`InitialTransaction`](../type-aliases/InitialTransaction.md)

Defined in: [packages/pulsar-core/src/types.ts:418](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L418)

The state for a transaction being initiated, used for verify feedback before it's submitted to the chain.

***

### lastAddedTxKey?

> `optional` **lastAddedTxKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:416](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L416)

The `txKey` of the most recently added transaction.

***

### reconcileUnsyncedTransactions

> **reconcileUnsyncedTransactions**: () => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:454](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L454)

Attempts to synchronize any transactions in `unsyncedTxKeys` that have reached a terminal
status but failed their initial `onRemoteCreate` call.

#### Returns

`Promise`\<`void`\>

***

### removeTxFromPool

> **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:434](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L434)

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

Defined in: [packages/pulsar-core/src/types.ts:414](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L414)

A pool of all transactions currently being tracked, indexed by `txKey`.

***

### unsyncedTxKeys?

> `optional` **unsyncedTxKeys?**: `Record`\<`string`, `boolean`\>

Defined in: [packages/pulsar-core/src/types.ts:449](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L449)

A record of transaction keys that failed to sync with the remote backend (Quasar)
when `onRemoteCreate` was called. They will be retried automatically.

***

### updateTxParams

> **updateTxParams**: (`txKey`, `fields`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:429](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L429)

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
