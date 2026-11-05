# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [packages/pulsar-core/src/types.ts:724](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L724)

The pagination state and action of the in-memory history store, as consumed by UI components.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [packages/pulsar-core/src/types.ts:732](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L732)

The last loaded page number.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:738](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L738)

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

Defined in: [packages/pulsar-core/src/types.ts:730](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L730)

`true` when the last loaded page reported a next page.

***

### isError

> **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:728](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L728)

`true` when the last history request failed.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:726](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L726)

`true` while a history page is loading.
