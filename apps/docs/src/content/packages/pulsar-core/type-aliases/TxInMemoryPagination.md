# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [types.ts:703](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L703)

The pagination state and action of the in-memory history store, as consumed by UI components.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [types.ts:711](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L711)

The last loaded page number.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [types.ts:717](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L717)

Loads the page after `currentPage` and merges it into the pool. Does nothing while loading, when `hasMore` is
`false`, or without `getHistory`.

#### Parameters

##### walletAddress

`string`

The wallet whose history is loaded.

#### Returns

`Promise`\<`void`\>

***

### hasMore

> **hasMore**: `boolean`

Defined in: [types.ts:709](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L709)

`true` when the last loaded page reported a next page.

***

### isError

> **isError**: `boolean`

Defined in: [types.ts:707](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L707)

`true` when the last history request failed.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [types.ts:705](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L705)

`true` while a history page is loading.
