[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxTrackingStore\<TR, T, A\>

> **ITxTrackingStore**\<`TR`, `T`, `A`\> = [`IInitializeTxTrackingStore`](IInitializeTxTrackingStore.md)\<`TR`, `T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:209](https://github.com/TuwaIO/pulsar-core/blob/c240bb5d3e8c1654c70ed6317097503807beff23/packages/pulsar-core/src/types.ts#L209)

Interface for the complete transaction tracking store.

## Type declaration

### handleTransaction()

> **handleTransaction**: (`params`) => `Promise`\<`void`\>

A wrapper function that handles the entire lifecycle of a transaction.
It creates an `InitialTransaction`, executes the on-chain action, and tracks its status.

#### Parameters

##### params

The parameters for handling the transaction.

###### actionFunction

() => `Promise`\<`A` \| `undefined`\>

The async function to execute (e.g., a smart contract write call).

###### defaultTracker?

`TR`

###### params

[`InitialTransactionParams`](InitialTransactionParams.md)

The metadata for the transaction to be created, of type `InitialTransactionParams`.

#### Returns

`Promise`\<`void`\>

### initializeTransactionsPool()

> **initializeTransactionsPool**: () => `Promise`\<`void`\>

Initializes all active trackers for pending transactions in the pool.
This is useful for resuming tracking after a page reload.

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

The return type of the action function being wrapped.

## Template

The configuration object type (e.g., wagmi config).
