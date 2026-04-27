[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxInMemoryStoreParameters\<T\>

> **ITxInMemoryStoreParameters**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:486](https://github.com/TuwaIO/pulsar-core/blob/e793f6c1aec3029357d46a261bbd91915587721b/packages/pulsar-core/src/types.ts#L486)

Parameters used to configure and manage an in-memory transaction store.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The transaction type.

## Properties

### getHistory?

> `optional` **getHistory?**: (`{
    page,
    walletAddress,
  }`) => `Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \} \| `null`\>

Defined in: [packages/pulsar-core/src/types.ts:493](https://github.com/TuwaIO/pulsar-core/blob/e793f6c1aec3029357d46a261bbd91915587721b/packages/pulsar-core/src/types.ts#L493)

#### Parameters

##### \{
    page,
    walletAddress,
  \}

###### page?

`number`

Page number for pagination.

**Default Value**

`1`

###### walletAddress

`string`

#### Returns

`Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \} \| `null`\>

***

### localTransactionsPool

> **localTransactionsPool**: [`TransactionPool`](TransactionPool.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:488](https://github.com/TuwaIO/pulsar-core/blob/e793f6c1aec3029357d46a261bbd91915587721b/packages/pulsar-core/src/types.ts#L488)

A localTransactionsPool.

***

### onHistoryFetched?

> `optional` **onHistoryFetched?**: (`remoteTxs`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:492](https://github.com/TuwaIO/pulsar-core/blob/e793f6c1aec3029357d46a261bbd91915587721b/packages/pulsar-core/src/types.ts#L492)

Callback fired when remote history is successfully fetched.
Used to inject remote pending transactions into the persistent tracking store.

#### Parameters

##### remoteTxs

`T`[]

#### Returns

`void`
