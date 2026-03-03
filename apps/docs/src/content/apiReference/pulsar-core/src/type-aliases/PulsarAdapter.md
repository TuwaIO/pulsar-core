[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# PulsarAdapter\<T\>

> **PulsarAdapter**\<`T`\> = `OrbitGenericAdapter`\<[`TxAdapter`](TxAdapter.md)\<`T`\>\> & `object` & [`SyncCallbacks`](../interfaces/SyncCallbacks.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:252](https://github.com/TuwaIO/pulsar-core/blob/519f4d89669ea26ac36d52c0628d99fc9619daf2/packages/pulsar-core/src/types.ts#L252)

The configuration object containing one or more transaction adapters.

## Type Declaration

### maxTransactions?

> `optional` **maxTransactions**: `number`

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type.
