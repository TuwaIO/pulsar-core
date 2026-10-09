# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [types.ts:658](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L658)

The pagination state and action of the in-memory history store, as consumed by UI components.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [types.ts:666](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L666)

The last loaded page number.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [types.ts:672](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L672)

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

Defined in: [types.ts:664](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L664)

`true` when the last loaded page reported a next page.

***

### isError

> **isError**: `boolean`

Defined in: [types.ts:662](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L662)

`true` when the last history request failed.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [types.ts:660](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L660)

`true` while a history page is loading.
