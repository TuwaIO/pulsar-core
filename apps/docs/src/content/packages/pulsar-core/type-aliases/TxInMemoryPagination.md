# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [packages/pulsar-core/src/types.ts:727](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L727)

The pagination state and action of the in-memory history store, as consumed by UI components.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [packages/pulsar-core/src/types.ts:735](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L735)

The last loaded page number.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:741](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L741)

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

Defined in: [packages/pulsar-core/src/types.ts:733](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L733)

`true` when the last loaded page reported a next page.

***

### isError

> **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:731](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L731)

`true` when the last history request failed.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:729](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L729)

`true` while a history page is loading.
