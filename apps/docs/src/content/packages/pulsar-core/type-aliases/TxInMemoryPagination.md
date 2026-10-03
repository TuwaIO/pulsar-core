# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [types.ts:627](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L627)

The pagination state and action of the in-memory history store, as consumed by UI components.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [types.ts:635](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L635)

The last loaded page number.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [types.ts:641](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L641)

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

Defined in: [types.ts:633](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L633)

`true` when the last loaded page reported a next page.

***

### isError

> **isError**: `boolean`

Defined in: [types.ts:631](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L631)

`true` when the last history request failed.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [types.ts:629](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L629)

`true` while a history page is loading.
