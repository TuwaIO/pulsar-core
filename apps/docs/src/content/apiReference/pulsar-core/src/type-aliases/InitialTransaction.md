[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransaction

> **InitialTransaction** = [`InitialTransactionParams`](InitialTransactionParams.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:176](https://github.com/TuwaIO/pulsar-core/blob/3c7dfd4bb35a5c5bf0b6bdf4d64b37f2ab5357a0/packages/pulsar-core/src/types.ts#L176)

Represents a transaction in its initial, pre-submission state within the store.
This is used for UI feedback while the transaction is being signed and sent.

## Type declaration

### errorMessage?

> `optional` **errorMessage**: `string`

An error message if the initialization process fails (e.g., user rejects signature).

### isInitializing

> **isInitializing**: `boolean`

True if the transaction is currently being processed (e.g., waiting for user signature).

### lastTxKey?

> `optional` **lastTxKey**: `string`

The key of the on-chain transaction that this action produced, used for linking.

### localTimestamp

> **localTimestamp**: `number`

The local timestamp when the user initiated the action.
