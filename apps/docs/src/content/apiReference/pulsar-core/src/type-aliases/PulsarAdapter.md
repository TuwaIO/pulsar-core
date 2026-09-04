[**API Reference.**](../../../README.md)

***

# PulsarAdapter\<T\>

> **PulsarAdapter**\<`T`\> = `OrbitGenericAdapter`\<[`TxAdapter`](TxAdapter.md)\<`T`\>\> & `object` & [`SyncCallbacks`](../interfaces/SyncCallbacks.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:267](https://github.com/TuwaIO/pulsar-core/blob/18e5da55b3b8542aa1cb462dd015c6097e4ec4f0/packages/pulsar-core/src/types.ts#L267)

The configuration object containing one or more transaction adapters.

## Type Declaration

### abortOnTxError?

> `optional` **abortOnTxError?**: `boolean`

Optional setting to abort the transaction if the beforeTxProcess hook or remote creation fails. Defaults to true.

### beforeTxProcess?

> `optional` **beforeTxProcess?**: [`BeforeTxProcess`](BeforeTxProcess.md)

Optional global preflight callback executed before every transaction unless locally overridden.

### gelatoApiKey?

> `optional` **gelatoApiKey?**: `string`

### maxTransactions?

> `optional` **maxTransactions?**: `number`

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type.
