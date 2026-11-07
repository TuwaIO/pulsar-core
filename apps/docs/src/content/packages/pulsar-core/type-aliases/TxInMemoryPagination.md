# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [packages/pulsar-core/src/types.ts:732](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L732)

The pagination state and action of the in-memory history store, as consumed by UI components.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [packages/pulsar-core/src/types.ts:740](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L740)

The last loaded page number.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:746](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L746)

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

Defined in: [packages/pulsar-core/src/types.ts:738](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L738)

`true` when the last loaded page reported a next page.

***

### isError

> **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:736](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L736)

`true` when the last history request failed.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:734](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L734)

`true` while a history page is loading.
