[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# PulsarAdapter\<T\>

> **PulsarAdapter**\<`T`\> = `OrbitGenericAdapter`\<[`TxAdapter`](TxAdapter.md)\<`T`\>\> & `object` & [`SyncCallbacks`](../interfaces/SyncCallbacks.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:255](https://github.com/TuwaIO/pulsar-core/blob/3776e8cceb12ffbe5dc480169b68929e67178ab8/packages/pulsar-core/src/types.ts#L255)

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
