[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxInMemoryStore\<T\>

> **ITxInMemoryStore**\<`T`\> = `object` & [`TxInMemoryPagination`](TxInMemoryPagination.md)

Defined in: [packages/pulsar-core/src/types.ts:494](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L494)

The complete interface for the Pulsar transaction in-memory store.
It keeps a paginated remote history in sync with a local transaction pool.

## Type Declaration

### fetchInitial

> **fetchInitial**: (`walletAddress`) => `Promise`\<`void`\>

Loads the first page of transaction history.

#### Parameters

##### walletAddress

`string`

#### Returns

`Promise`\<`void`\>

### syncWithLocalPool

> **syncWithLocalPool**: (`localPool`) => `void`

Merges a local transaction pool into the in-memory store.

#### Parameters

##### localPool

[`TransactionPool`](TransactionPool.md)\<`T`\>

#### Returns

`void`

### transactionsPool

> **transactionsPool**: [`TransactionPool`](TransactionPool.md)\<`T`\>

A pool of all transactions currently being tracked and loaded from history, indexed by `txKey`.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The transaction type.
