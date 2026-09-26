# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [types.ts:624](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L624)

The pagination state and action of the in-memory history store, as consumed by UI components.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [types.ts:632](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L632)

The last loaded page number.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [types.ts:638](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L638)

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

Defined in: [types.ts:630](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L630)

`true` when the last loaded page reported a next page.

***

### isError

> **isError**: `boolean`

Defined in: [types.ts:628](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L628)

`true` when the last history request failed.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [types.ts:626](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L626)

`true` while a history page is loading.
