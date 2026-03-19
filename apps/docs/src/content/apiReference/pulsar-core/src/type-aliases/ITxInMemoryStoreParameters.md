[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxInMemoryStoreParameters\<T\>

> **ITxInMemoryStoreParameters**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:476](https://github.com/TuwaIO/pulsar-core/blob/409d179eb7db474173c52a361610758253656cc7/packages/pulsar-core/src/types.ts#L476)

Parameters used to configure and manage an in-memory transaction store.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The transaction type.

## Properties

### appName

> **appName**: `string`

Defined in: [packages/pulsar-core/src/types.ts:478](https://github.com/TuwaIO/pulsar-core/blob/409d179eb7db474173c52a361610758253656cc7/packages/pulsar-core/src/types.ts#L478)

App name for transactions filtering.

***

### getHistory()?

> `optional` **getHistory**: (`{
    page,
    limit,
    appName,
  }`) => `Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \}\>

Defined in: [packages/pulsar-core/src/types.ts:487](https://github.com/TuwaIO/pulsar-core/blob/409d179eb7db474173c52a361610758253656cc7/packages/pulsar-core/src/types.ts#L487)

Fetches transaction history from a remote source.

#### Parameters

##### \{
    page,
    limit,
    appName,
  \}

###### appName?

`string`

Filters history by application name.

###### limit?

`number`

Maximum number of results per page.

**Default Value**

`10`

###### page?

`number`

Page number for pagination.

**Default Value**

`1`

#### Returns

`Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \}\>

A paginated transaction history response.

***

### limit?

> `optional` **limit**: `number`

Defined in: [packages/pulsar-core/src/types.ts:480](https://github.com/TuwaIO/pulsar-core/blob/409d179eb7db474173c52a361610758253656cc7/packages/pulsar-core/src/types.ts#L480)

The maximum number of transactions fetched per page.
