[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxInMemoryStoreParameters\<T\>

> **ITxInMemoryStoreParameters**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:483](https://github.com/TuwaIO/pulsar-core/blob/3bc7ad7f218c235540ef1eb27cc5de5c737dbede/packages/pulsar-core/src/types.ts#L483)

Parameters used to configure and manage an in-memory transaction store.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The transaction type.

## Properties

### getHistory()?

> `optional` **getHistory**: (`{
    page,
  }`) => `Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \}\>

Defined in: [packages/pulsar-core/src/types.ts:484](https://github.com/TuwaIO/pulsar-core/blob/3bc7ad7f218c235540ef1eb27cc5de5c737dbede/packages/pulsar-core/src/types.ts#L484)

#### Parameters

##### \{
    page,
  \}

###### page?

`number`

Page number for pagination.

**Default Value**

`1`

#### Returns

`Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \}\>
