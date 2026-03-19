[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createTxInMemoryStore()

> **createTxInMemoryStore**\<`T`\>(`params`): `StoreApi`\<[`ITxInMemoryStore`](../type-aliases/ITxInMemoryStore.md)\<`T`\>\>

Defined in: [packages/pulsar-core/src/store/txInMemoryStore.ts:63](https://github.com/TuwaIO/pulsar-core/blob/df64e6e2a3068f5625f2d13b70fb044828dcd8ee/packages/pulsar-core/src/store/txInMemoryStore.ts#L63)

Creates an in-memory transaction store with synchronized local and remote sources.

The store is designed to:
- keep a local transaction pool in sync with remote history
- preserve terminal transaction states
- support paginated history loading
- avoid duplicated merge logic across store actions

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The transaction type.

## Parameters

### params

[`ITxInMemoryStoreParameters`](../type-aliases/ITxInMemoryStoreParameters.md)\<`T`\>

Store configuration parameters.

## Returns

`StoreApi`\<[`ITxInMemoryStore`](../type-aliases/ITxInMemoryStore.md)\<`T`\>\>

A Zustand vanilla store instance for in-memory transaction management.
