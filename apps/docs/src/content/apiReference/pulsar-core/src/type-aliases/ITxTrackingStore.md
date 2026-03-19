[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxTrackingStore\<T\>

> **ITxTrackingStore**\<`T`\> = [`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:416](https://github.com/TuwaIO/pulsar-core/blob/af611573e4695e0c821dd37abe309706e04c12a6/packages/pulsar-core/src/types.ts#L416)

The complete interface for the Pulsar transaction tracking store.

## Type Declaration

### executeTxAction()

> **executeTxAction**: (`params`) => `Promise`\<`void`\>

The primary method for initiating and tracking a new transaction from start to finish.
It manages UI state, executes the on-chain action, and initiates background tracking.

#### Parameters

##### params

`object` & [`TrackerCallbacks`](../interfaces/TrackerCallbacks.md)\<`T`\>

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

### injectExternalPendingTxs()

> **injectExternalPendingTxs**: (`remoteTxs`) => `Promise`\<`void`\>

Cross-device synchronization bridge.
Injects remote pending transactions into the local pool and starts their lifecycle trackers.
Also self-heals local pending transactions if the remote DB knows they are terminal.

#### Parameters

##### remoteTxs

`T`[]

#### Returns

`Promise`\<`void`\>

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The transaction type.
