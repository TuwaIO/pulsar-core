[**API Reference.**](../../../README.md)

***

# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [packages/pulsar-core/src/types.ts:507](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L507)

Represents the structure and behavior of an in-memory pagination system
for managing transaction history.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [packages/pulsar-core/src/types.ts:515](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L515)

The current page number in the paginated history.

***

### fetchNextPage

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:517](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L517)

Loads the next page of transaction history and appends it to the pool.

#### Parameters

##### walletAddress

`string`

#### Returns

`Promise`\<`void`\>

***

### hasMore

> **hasMore**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:513](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L513)

Indicates whether more history pages are available.

***

### isError

> **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:511](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L511)

Indicates whether the last loading request ended with an error.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:509](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L509)

Indicates whether the store is currently loading transaction history.
