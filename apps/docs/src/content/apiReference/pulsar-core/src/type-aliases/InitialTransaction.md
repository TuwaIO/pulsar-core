[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransaction\<A\>

> **InitialTransaction**\<`A`\> = [`InitialTransactionParams`](InitialTransactionParams.md)\<`A`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:203](https://github.com/TuwaIO/pulsar-core/blob/f426f4bfc26016d7fbea4fd9c0d9ff73fe1677fe/packages/pulsar-core/src/types.ts#L203)

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
