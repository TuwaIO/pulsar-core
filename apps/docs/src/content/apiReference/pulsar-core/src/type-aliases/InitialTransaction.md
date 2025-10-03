[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransaction

> **InitialTransaction** = [`InitialTransactionParams`](InitialTransactionParams.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:200](https://github.com/TuwaIO/pulsar-core/blob/fa53be494bf60c2dfc7d93a5ee62023074055721/packages/pulsar-core/src/types.ts#L200)

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
