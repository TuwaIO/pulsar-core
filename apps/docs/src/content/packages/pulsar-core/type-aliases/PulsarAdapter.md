# PulsarAdapter\<T\>

> **PulsarAdapter**\<`T`\> = `OrbitGenericAdapter`\<[`TxAdapter`](/packages/pulsar-core/type-aliases/TxAdapter.md)\<`T`\>\> & `object` & [`SyncCallbacks`](/packages/pulsar-core/interfaces/SyncCallbacks.md)\<`T`\>

Defined in: [types.ts:351](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L351)

The configuration of `createPulsarStore`: one or more chain adapters and the store options.

## Type Declaration

### abortOnTxError?

> `optional` **abortOnTxError?**: `boolean`

Whether an error thrown by `beforeTxProcess` aborts the transaction. Defaults to `true`. It does not apply to
`onRemoteCreate`, whose errors never abort the transaction.

### beforeTxProcess?

> `optional` **beforeTxProcess?**: [`BeforeTxProcess`](/packages/pulsar-core/type-aliases/BeforeTxProcess.md)

Global preflight callback run before every transaction. A `beforeTxProcess` passed to `executeTxAction` replaces it.

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

#### Deprecated

Gelato relay is deprecated. Gelato API key used to track `TransactionTracker.Gelato` transactions.

### maxTransactions?

> `optional` **maxTransactions?**: `number`

Maximum number of transactions in the pool. When it is full, the oldest one (by `localTimestamp`) is evicted. Defaults to 50.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.
