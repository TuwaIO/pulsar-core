[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# PulsarAdapter\<T\>

> **PulsarAdapter**\<`T`\> = `OrbitGenericAdapter`\<[`TxAdapter`](TxAdapter.md)\<`T`\>\> & `object` & [`SyncCallbacks`](../interfaces/SyncCallbacks.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:240](https://github.com/TuwaIO/pulsar-core/blob/67e084a82254dbfdb29bea89f48ef8ff884b8379/packages/pulsar-core/src/types.ts#L240)

The configuration object containing one or more transaction adapters.

## Type Declaration

### gelatoApiKey?

> `optional` **gelatoApiKey?**: `string`

### maxTransactions?

> `optional` **maxTransactions?**: `number`

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type.
