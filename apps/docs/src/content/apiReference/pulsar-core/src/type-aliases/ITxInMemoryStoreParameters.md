[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxInMemoryStoreParameters\<T\>

> **ITxInMemoryStoreParameters**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:489](https://github.com/TuwaIO/pulsar-core/blob/77d854db952885a45741c9beecf7242bfe595543/packages/pulsar-core/src/types.ts#L489)

Parameters used to configure and manage an in-memory transaction store.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The transaction type.

## Properties

### getHistory()?

> `optional` **getHistory**: (`{
    page,
    walletAddress,
  }`) => `Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \}\>

Defined in: [packages/pulsar-core/src/types.ts:494](https://github.com/TuwaIO/pulsar-core/blob/77d854db952885a45741c9beecf7242bfe595543/packages/pulsar-core/src/types.ts#L494)

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

`Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \}\>

***

### onHistoryFetched()?

> `optional` **onHistoryFetched**: (`remoteTxs`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:493](https://github.com/TuwaIO/pulsar-core/blob/77d854db952885a45741c9beecf7242bfe595543/packages/pulsar-core/src/types.ts#L493)

Callback fired when remote history is successfully fetched.
Used to inject remote pending transactions into the persistent tracking store.

#### Parameters

##### remoteTxs

`T`[]

#### Returns

`void`
