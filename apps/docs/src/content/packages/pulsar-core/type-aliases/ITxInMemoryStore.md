# ITxInMemoryStore\<T\>

> **ITxInMemoryStore**\<`T`\> = `object` & [`TxInMemoryPagination`](/packages/pulsar-core/type-aliases/TxInMemoryPagination.md)

Defined in: [packages/pulsar-core/src/types.ts:770](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L770)

The state and actions of the store created by `createTxInMemoryStore`: a paginated remote history merged with the
local pool. Nothing in it is persisted.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

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

### removeTxFromPool

> **removeTxFromPool**: (`txKey`) => `void`

Removes a transaction for as long as this page lives: later syncs and history pages do not bring it back. Call it next
to `removeTxFromPool` of the persistent store, as when a person stops tracking a transaction that never ends, or the
record stays here, pending for good, with nothing left to finish it.

#### Parameters

##### txKey

`string`

The key of the transaction.

#### Returns

`void`

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
