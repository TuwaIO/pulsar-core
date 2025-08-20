[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransaction

> **InitialTransaction** = [`InitialTransactionParams`](InitialTransactionParams.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:172](https://github.com/TuwaIO/pulsar-core/blob/3276bf16709f6ec29953e98e8eed75f9c97b41d2/packages/pulsar-core/src/types.ts#L172)

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
