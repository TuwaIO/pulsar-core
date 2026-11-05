# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [types.ts:716](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L716)

The pagination state and action of the in-memory history store, as consumed by UI components.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [types.ts:724](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L724)

The last loaded page number.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [types.ts:730](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L730)

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

Defined in: [types.ts:722](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L722)

`true` when the last loaded page reported a next page.

***

### isError

> **isError**: `boolean`

Defined in: [types.ts:720](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L720)

`true` when the last history request failed.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [types.ts:718](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L718)

`true` while a history page is loading.
