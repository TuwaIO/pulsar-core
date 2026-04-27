[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [packages/pulsar-core/src/types.ts:451](https://github.com/TuwaIO/pulsar-core/blob/1c91d65eda8baf365ba3ddea0556929964753b54/packages/pulsar-core/src/types.ts#L451)

Represents the structure and behavior of an in-memory pagination system
for managing transaction history.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [packages/pulsar-core/src/types.ts:459](https://github.com/TuwaIO/pulsar-core/blob/1c91d65eda8baf365ba3ddea0556929964753b54/packages/pulsar-core/src/types.ts#L459)

The current page number in the paginated history.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:461](https://github.com/TuwaIO/pulsar-core/blob/1c91d65eda8baf365ba3ddea0556929964753b54/packages/pulsar-core/src/types.ts#L461)

Loads the next page of transaction history and appends it to the pool.

#### Parameters

##### walletAddress

`string`

#### Returns

`Promise`\<`void`\>

***

### hasMore

> **hasMore**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:457](https://github.com/TuwaIO/pulsar-core/blob/1c91d65eda8baf365ba3ddea0556929964753b54/packages/pulsar-core/src/types.ts#L457)

Indicates whether more history pages are available.

***

### isError

> **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:455](https://github.com/TuwaIO/pulsar-core/blob/1c91d65eda8baf365ba3ddea0556929964753b54/packages/pulsar-core/src/types.ts#L455)

Indicates whether the last loading request ended with an error.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:453](https://github.com/TuwaIO/pulsar-core/blob/1c91d65eda8baf365ba3ddea0556929964753b54/packages/pulsar-core/src/types.ts#L453)

Indicates whether the store is currently loading transaction history.
