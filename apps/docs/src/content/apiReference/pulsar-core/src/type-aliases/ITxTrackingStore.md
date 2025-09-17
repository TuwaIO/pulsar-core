[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxTrackingStore\<T\>

> **ITxTrackingStore**\<`T`\> = [`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:302](https://github.com/TuwaIO/pulsar-core/blob/588f0298eed13d576622f00b75515bcca31625e2/packages/pulsar-core/src/types.ts#L302)

The complete interface for the Pulsar transaction tracking store.

## Type Declaration

### handleTransaction()

> **handleTransaction**: (`params`) => `Promise`\<`void`\>

The primary method for initiating and tracking a new transaction from start to finish.
It manages UI state, executes the on-chain action, and initiates background tracking.

#### Parameters

##### params

The parameters for handling the transaction.

###### actionFunction

() => `Promise`\<[`ActionTxKey`](ActionTxKey.md) \| `undefined`\>

The async function to execute (e.g., a smart contract write call). Must return a unique key or undefined.

###### defaultTracker?

[`TransactionTracker`](../enumerations/TransactionTracker.md)

The default tracker to use if it cannot be determined automatically.

###### params

`Omit`\<[`InitialTransactionParams`](InitialTransactionParams.md), `"actionFunction"`\>

The metadata for the transaction.

#### Returns

`Promise`\<`void`\>

### initializeTransactionsPool()

> **initializeTransactionsPool**: () => `Promise`\<`void`\>

Initializes trackers for all pending transactions in the pool.
This is essential for resuming tracking after a page reload.

#### Returns

`Promise`\<`void`\>

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The transaction type.
