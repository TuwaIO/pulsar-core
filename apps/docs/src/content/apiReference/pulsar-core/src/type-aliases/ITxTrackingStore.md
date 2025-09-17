[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxTrackingStore\<TR, T, A\>

> **ITxTrackingStore**\<`TR`, `T`, `A`\> = [`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`TR`, `T`, `A`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:272](https://github.com/TuwaIO/pulsar-core/blob/b6b6c3a1756747dcac62deff3f3b4bb3716a2405/packages/pulsar-core/src/types.ts#L272)

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

() => `Promise`\<`A` \| `undefined`\>

The async function to execute (e.g., a smart contract write call). Must return a unique key or undefined.

###### defaultTracker?

`TR`

The default tracker to use if it cannot be determined automatically.

###### params

`Omit`\<[`InitialTransactionParams`](InitialTransactionParams.md)\<`A`\>, `"actionFunction"`\>

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

### TR

`TR`

The type of the tracker identifier.

### T

`T` *extends* [`Transaction`](Transaction.md)\<`TR`\>

The transaction type.

### A

`A`

The return type of the `actionFunction`.
