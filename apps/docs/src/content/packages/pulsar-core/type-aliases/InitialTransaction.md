# InitialTransaction

> **InitialTransaction** = [`InitialTransactionParams`](/packages/pulsar-core/type-aliases/InitialTransactionParams.md) & `object`

Defined in: [types.ts:285](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L285)

The state of a transaction while `executeTxAction` runs, before it is added to the pool. UI layers use it for
immediate feedback (signature prompts, preflight errors).

## Type Declaration

### error?

> `optional` **error?**: `TuwaErrorState`

The normalized error when the flow failed before tracking started, for example a rejected signature.

### isInitializing

> **isInitializing**: `boolean`

`true` from the start of `executeTxAction` until the transaction is added to the pool or the flow fails.

### lastTxKey?

> `optional` **lastTxKey?**: `string`

The `txKey` of the transaction this action added to the pool.

### localTimestamp

> **localTimestamp**: `number`

Unix timestamp (seconds) when `executeTxAction` started.
