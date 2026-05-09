[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createTxInMemoryStore()

> **createTxInMemoryStore**\<`T`\>(`params`): `StoreApi`\<[`ITxInMemoryStore`](../type-aliases/ITxInMemoryStore.md)\<`T`\>\>

Defined in: [packages/pulsar-core/src/store/txInMemoryStore.ts:67](https://github.com/TuwaIO/pulsar-core/blob/ab16a1aebc8b33c0a47cb0737caca7e0c28e4818/packages/pulsar-core/src/store/txInMemoryStore.ts#L67)

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
