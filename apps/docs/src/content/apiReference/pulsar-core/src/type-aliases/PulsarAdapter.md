[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# PulsarAdapter\<T\>

> **PulsarAdapter**\<`T`\> = `OrbitGenericAdapter`\<[`TxAdapter`](TxAdapter.md)\<`T`\>\> & `object` & [`SyncCallbacks`](../interfaces/SyncCallbacks.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:245](https://github.com/TuwaIO/pulsar-core/blob/d0c4882888327c2e3f6b0b4137e2a4cb2f61a986/packages/pulsar-core/src/types.ts#L245)

The configuration object containing one or more transaction adapters.

## Type Declaration

### gelatoApiKey?

> `optional` **gelatoApiKey**: `string`

### maxTransactions?

> `optional` **maxTransactions**: `number`

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type.
