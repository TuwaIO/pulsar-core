# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [packages/pulsar-core/src/types.ts:747](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L747)

The pagination state and action of the in-memory history store, as consumed by UI components.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [packages/pulsar-core/src/types.ts:755](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L755)

The last loaded page number.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:761](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L761)

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

Defined in: [packages/pulsar-core/src/types.ts:753](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L753)

`true` when the last loaded page reported a next page.

***

### isError

> **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:751](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L751)

`true` when the last history request failed.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:749](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L749)

`true` while a history page is loading.
