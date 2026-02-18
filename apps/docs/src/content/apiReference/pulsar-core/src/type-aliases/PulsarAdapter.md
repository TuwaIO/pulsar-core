[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# PulsarAdapter\<T\>

> **PulsarAdapter**\<`T`\> = `OrbitGenericAdapter`\<[`TxAdapter`](TxAdapter.md)\<`T`\>\> & `object` & [`SyncCallbacks`](../interfaces/SyncCallbacks.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:258](https://github.com/TuwaIO/pulsar-core/blob/b6258073b240e3dc780d2485188e70f062560dbc/packages/pulsar-core/src/types.ts#L258)

The configuration object containing one or more transaction adapters.

## Type Declaration

### maxTransactions?

> `optional` **maxTransactions**: `number`

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type.
