# ITxInMemoryStore\<T\>

> **ITxInMemoryStore**\<`T`\> = `object` & [`TxInMemoryPagination`](/packages/pulsar-core/type-aliases/TxInMemoryPagination.md)

Defined in: [types.ts:656](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L656)

The state and actions of the store created by `createTxInMemoryStore`: a paginated remote history merged with the
local pool. Nothing in it is persisted.

## Type Declaration

### fetchInitial

> **fetchInitial**: (`walletAddress`) => `Promise`\<`void`\>

Runs `reconcileUnsyncedTransactions` (if provided), then loads the first history page and merges it into the
pool. Does nothing without `getHistory` or an empty `walletAddress`.

#### Parameters

##### walletAddress

`string`

The wallet whose history is loaded.

#### Returns

`Promise`\<`void`\>

### syncWithLocalPool

> **syncWithLocalPool**: (`localPool`) => `void`

Merges a local pool into the in-memory pool. Transactions that are `Success`, `Failed` or `Replaced` in memory are
kept; pending ones are overwritten only by a terminal transaction or one with more confirmations.

#### Parameters

##### localPool

[`TransactionPool`](/packages/pulsar-core/type-aliases/TransactionPool.md)\<`T`\>

The pool of the persistent store, usually from its `subscribe` listener.

#### Returns

`void`

### transactionsPool

> **transactionsPool**: [`TransactionPool`](/packages/pulsar-core/type-aliases/TransactionPool.md)\<`T`\>

The local and remote transactions, indexed by `txKey`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.
