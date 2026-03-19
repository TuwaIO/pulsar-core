[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxInMemoryStore\<T\>

> **ITxInMemoryStore**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:452](https://github.com/TuwaIO/pulsar-core/blob/df64e6e2a3068f5625f2d13b70fb044828dcd8ee/packages/pulsar-core/src/types.ts#L452)

The complete interface for the Pulsar transaction in-memory store.
It keeps a paginated remote history in sync with a local transaction pool.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The transaction type.

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [packages/pulsar-core/src/types.ts:462](https://github.com/TuwaIO/pulsar-core/blob/df64e6e2a3068f5625f2d13b70fb044828dcd8ee/packages/pulsar-core/src/types.ts#L462)

The current page number in the paginated history.

***

### fetchInitial()

> **fetchInitial**: () => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:464](https://github.com/TuwaIO/pulsar-core/blob/df64e6e2a3068f5625f2d13b70fb044828dcd8ee/packages/pulsar-core/src/types.ts#L464)

Loads the first page of transaction history.

#### Returns

`Promise`\<`void`\>

***

### fetchNextPage()

> **fetchNextPage**: () => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:466](https://github.com/TuwaIO/pulsar-core/blob/df64e6e2a3068f5625f2d13b70fb044828dcd8ee/packages/pulsar-core/src/types.ts#L466)

Loads the next page of transaction history and appends it to the pool.

#### Returns

`Promise`\<`void`\>

***

### hasMore

> **hasMore**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:460](https://github.com/TuwaIO/pulsar-core/blob/df64e6e2a3068f5625f2d13b70fb044828dcd8ee/packages/pulsar-core/src/types.ts#L460)

Indicates whether more history pages are available.

***

### isError

> **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:458](https://github.com/TuwaIO/pulsar-core/blob/df64e6e2a3068f5625f2d13b70fb044828dcd8ee/packages/pulsar-core/src/types.ts#L458)

Indicates whether the last loading request ended with an error.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:456](https://github.com/TuwaIO/pulsar-core/blob/df64e6e2a3068f5625f2d13b70fb044828dcd8ee/packages/pulsar-core/src/types.ts#L456)

Indicates whether the store is currently loading transaction history.

***

### syncWithLocalPool()

> **syncWithLocalPool**: (`localPool`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:468](https://github.com/TuwaIO/pulsar-core/blob/df64e6e2a3068f5625f2d13b70fb044828dcd8ee/packages/pulsar-core/src/types.ts#L468)

Merges a local transaction pool into the in-memory store.

#### Parameters

##### localPool

[`TransactionPool`](TransactionPool.md)\<`T`\>

#### Returns

`void`

***

### transactionsPool

> **transactionsPool**: [`TransactionPool`](TransactionPool.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:454](https://github.com/TuwaIO/pulsar-core/blob/df64e6e2a3068f5625f2d13b70fb044828dcd8ee/packages/pulsar-core/src/types.ts#L454)

A pool of all transactions currently being tracked and loaded from history, indexed by `txKey`.
