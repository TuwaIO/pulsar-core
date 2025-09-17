[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransaction\<A\>

> **InitialTransaction**\<`A`\> = [`InitialTransactionParams`](InitialTransactionParams.md)\<`A`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:201](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-core/src/types.ts#L201)

Represents a transaction in its temporary, pre-submission state.
This is used for UI feedback while the transaction is being signed and sent.

## Type Declaration

### errorMessage?

> `optional` **errorMessage**: `string`

An error message if the initialization fails (e.g., user rejects signature).

### isInitializing

> **isInitializing**: `boolean`

A flag indicating if the transaction is being processed (e.g., waiting for signature).

### lastTxKey?

> `optional` **lastTxKey**: `string`

The `txKey` of the on-chain transaction that this action produced, used for linking the states.

### localTimestamp

> **localTimestamp**: `number`

The local timestamp when the user initiated the action.

## Type Parameters

### A

`A`
