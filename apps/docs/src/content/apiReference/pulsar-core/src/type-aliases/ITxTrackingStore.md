[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxTrackingStore\<T\>

> **ITxTrackingStore**\<`T`\> = [`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:398](https://github.com/TuwaIO/pulsar-core/blob/bb713c77f40529591b60b09e6733b530afc12e18/packages/pulsar-core/src/types.ts#L398)

The complete interface for the Pulsar transaction tracking store.

## Type Declaration

### getAdapter()

> **getAdapter**: () => [`TxAdapter`](TxAdapter.md)\<`T`\> \| [`TxAdapter`](TxAdapter.md)\<`T`\>[]

A getter function that returns the configured transaction adapter(s).

#### Returns

[`TxAdapter`](TxAdapter.md)\<`T`\> \| [`TxAdapter`](TxAdapter.md)\<`T`\>[]

### handleTransaction()

> **handleTransaction**: (`params`) => `Promise`\<`void`\>

The primary method for initiating and tracking a new transaction from start to finish.
It manages UI state, executes the on-chain action, and initiates background tracking.

#### Parameters

##### params

`object` & [`OnSuccessCallback`](OnSuccessCallback.md)\<`T`\>

The parameters for handling the transaction.

#### Returns

`Promise`\<`void`\>

### initializeTransactionsPool()

> **initializeTransactionsPool**: () => `Promise`\<`void`\>

Initializes trackers for all pending transactions in the pool.
This is essential for resuming tracking after a page reload or application restart.

#### Returns

`Promise`\<`void`\>

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The transaction type.
