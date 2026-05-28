[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [packages/pulsar-core/src/types.ts:475](https://github.com/TuwaIO/pulsar-core/blob/f07064903bf5431471f5c03abc5368cb0a7305e3/packages/pulsar-core/src/types.ts#L475)

Represents the structure and behavior of an in-memory pagination system
for managing transaction history.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [packages/pulsar-core/src/types.ts:483](https://github.com/TuwaIO/pulsar-core/blob/f07064903bf5431471f5c03abc5368cb0a7305e3/packages/pulsar-core/src/types.ts#L483)

The current page number in the paginated history.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:485](https://github.com/TuwaIO/pulsar-core/blob/f07064903bf5431471f5c03abc5368cb0a7305e3/packages/pulsar-core/src/types.ts#L485)

Loads the next page of transaction history and appends it to the pool.

#### Parameters

##### walletAddress

`string`

#### Returns

`Promise`\<`void`\>

***

### hasMore

> **hasMore**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:481](https://github.com/TuwaIO/pulsar-core/blob/f07064903bf5431471f5c03abc5368cb0a7305e3/packages/pulsar-core/src/types.ts#L481)

Indicates whether more history pages are available.

***

### isError

> **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:479](https://github.com/TuwaIO/pulsar-core/blob/f07064903bf5431471f5c03abc5368cb0a7305e3/packages/pulsar-core/src/types.ts#L479)

Indicates whether the last loading request ended with an error.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:477](https://github.com/TuwaIO/pulsar-core/blob/f07064903bf5431471f5c03abc5368cb0a7305e3/packages/pulsar-core/src/types.ts#L477)

Indicates whether the store is currently loading transaction history.
