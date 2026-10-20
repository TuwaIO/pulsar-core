# PulsarAdapter\<T\>

> **PulsarAdapter**\<`T`\> = `OrbitGenericAdapter`\<[`TxAdapter`](/packages/pulsar-core/type-aliases/TxAdapter.md)\<`T`\>\> & `object` & [`SyncCallbacks`](/packages/pulsar-core/interfaces/SyncCallbacks.md)\<`T`\>

Defined in: [types.ts:391](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L391)

The configuration of `createPulsarStore`: one or more chain adapters and the store options.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

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

Maximum number of transactions in the pool. When it is full, the oldest finished ones (by `localTimestamp`) are
evicted; pending transactions are never evicted, so while more of them are pending the pool holds more. Defaults to
50.

### onTxFinished?

> `optional` **onTxFinished?**: [`TxFinishedListener`](/packages/pulsar-core/type-aliases/TxFinishedListener.md)\<`T`\>

Called once when a transaction finishes (see `TxFinishedListener`), also when a tracker restarted after a page
reload finishes it. Runs before the listeners added with `subscribeTxFinished`.

### retentionDays?

> `optional` **retentionDays?**: `number` \| `null`

Days a finished transaction stays in the pool, counted from its `finishedTimestamp` (or `localTimestamp` when it
has none). Expired ones are dropped when the saved state is restored and when a transaction is added; pending
transactions stay until they finish. `null` keeps finished transactions until `maxTransactions` evicts them.
Defaults to 30.
