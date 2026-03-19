[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxInMemoryStoreParameters\<T\>

> **ITxInMemoryStoreParameters**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:483](https://github.com/TuwaIO/pulsar-core/blob/5f182e29003409398051d1d02ec9c947396d97e5/packages/pulsar-core/src/types.ts#L483)

Parameters used to configure and manage an in-memory transaction store.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The transaction type.

## Properties

### appName

> **appName**: `string`

Defined in: [packages/pulsar-core/src/types.ts:485](https://github.com/TuwaIO/pulsar-core/blob/5f182e29003409398051d1d02ec9c947396d97e5/packages/pulsar-core/src/types.ts#L485)

App name for transactions filtering.

***

### getHistory()?

> `optional` **getHistory**: (`{
    page,
    limit,
    appName,
  }`) => `Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \}\>

Defined in: [packages/pulsar-core/src/types.ts:494](https://github.com/TuwaIO/pulsar-core/blob/5f182e29003409398051d1d02ec9c947396d97e5/packages/pulsar-core/src/types.ts#L494)

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

Defined in: [packages/pulsar-core/src/types.ts:487](https://github.com/TuwaIO/pulsar-core/blob/5f182e29003409398051d1d02ec9c947396d97e5/packages/pulsar-core/src/types.ts#L487)

The maximum number of transactions fetched per page.
