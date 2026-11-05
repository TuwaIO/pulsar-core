# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [packages/pulsar-core/src/types.ts:733](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L733)

The pagination state and action of the in-memory history store, as consumed by UI components.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [packages/pulsar-core/src/types.ts:741](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L741)

The last loaded page number.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:747](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L747)

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

Defined in: [packages/pulsar-core/src/types.ts:739](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L739)

`true` when the last loaded page reported a next page.

***

### isError

> **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:737](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L737)

`true` when the last history request failed.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:735](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L735)

`true` while a history page is loading.
