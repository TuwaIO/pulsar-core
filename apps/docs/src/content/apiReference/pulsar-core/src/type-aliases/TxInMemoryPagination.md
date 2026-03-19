[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxInMemoryPagination

> **TxInMemoryPagination** = `object`

Defined in: [packages/pulsar-core/src/types.ts:456](https://github.com/TuwaIO/pulsar-core/blob/af611573e4695e0c821dd37abe309706e04c12a6/packages/pulsar-core/src/types.ts#L456)

Represents the structure and behavior of an in-memory pagination system
for managing transaction history.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [packages/pulsar-core/src/types.ts:464](https://github.com/TuwaIO/pulsar-core/blob/af611573e4695e0c821dd37abe309706e04c12a6/packages/pulsar-core/src/types.ts#L464)

The current page number in the paginated history.

***

### fetchNextPage()

> **fetchNextPage**: (`walletAddress`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:466](https://github.com/TuwaIO/pulsar-core/blob/af611573e4695e0c821dd37abe309706e04c12a6/packages/pulsar-core/src/types.ts#L466)

Loads the next page of transaction history and appends it to the pool.

#### Parameters

##### walletAddress

`string`

#### Returns

`Promise`\<`void`\>

***

### hasMore

> **hasMore**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:462](https://github.com/TuwaIO/pulsar-core/blob/af611573e4695e0c821dd37abe309706e04c12a6/packages/pulsar-core/src/types.ts#L462)

Indicates whether more history pages are available.

***

### isError

> **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:460](https://github.com/TuwaIO/pulsar-core/blob/af611573e4695e0c821dd37abe309706e04c12a6/packages/pulsar-core/src/types.ts#L460)

Indicates whether the last loading request ended with an error.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:458](https://github.com/TuwaIO/pulsar-core/blob/af611573e4695e0c821dd37abe309706e04c12a6/packages/pulsar-core/src/types.ts#L458)

Indicates whether the store is currently loading transaction history.
