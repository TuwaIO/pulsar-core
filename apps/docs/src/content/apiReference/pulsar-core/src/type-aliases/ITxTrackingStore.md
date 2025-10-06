[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxTrackingStore\<T\>

> **ITxTrackingStore**\<`T`\> = [`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:383](https://github.com/TuwaIO/pulsar-core/blob/bdceb94ce44190f4d3014c2e4cf435b68c70b5b1/packages/pulsar-core/src/types.ts#L383)

The complete interface for the Pulsar transaction tracking store.

## Type Declaration

### executeTxAction()

> **executeTxAction**: (`params`) => `Promise`\<`void`\>

The primary method for initiating and tracking a new transaction from start to finish.
It manages UI state, executes the on-chain action, and initiates background tracking.

#### Parameters

##### params

`object` & [`OnSuccessCallback`](OnSuccessCallback.md)\<`T`\>

The parameters for handling the transaction.

#### Returns

`Promise`\<`void`\>

### getAdapter()

> **getAdapter**: () => [`TxAdapter`](TxAdapter.md)\<`T`\> \| [`TxAdapter`](TxAdapter.md)\<`T`\>[]

A getter function that returns the configured transaction adapter(s).

#### Returns

[`TxAdapter`](TxAdapter.md)\<`T`\> \| [`TxAdapter`](TxAdapter.md)\<`T`\>[]

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
