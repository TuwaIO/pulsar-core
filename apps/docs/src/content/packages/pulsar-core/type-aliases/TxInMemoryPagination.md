# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [types.ts:633](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L633)

The pagination state and action of the in-memory history store, as consumed by UI components.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [types.ts:641](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L641)

The last loaded page number.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [types.ts:647](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L647)

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

Defined in: [types.ts:639](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L639)

`true` when the last loaded page reported a next page.

***

### isError

> **isError**: `boolean`

Defined in: [types.ts:637](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L637)

`true` when the last history request failed.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [types.ts:635](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L635)

`true` while a history page is loading.
