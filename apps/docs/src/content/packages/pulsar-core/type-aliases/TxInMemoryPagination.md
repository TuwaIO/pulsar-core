# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [types.ts:665](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L665)

The pagination state and action of the in-memory history store, as consumed by UI components.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [types.ts:673](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L673)

The last loaded page number.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [types.ts:679](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L679)

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

Defined in: [types.ts:671](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L671)

`true` when the last loaded page reported a next page.

***

### isError

> **isError**: `boolean`

Defined in: [types.ts:669](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L669)

`true` when the last history request failed.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [types.ts:667](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L667)

`true` while a history page is loading.
