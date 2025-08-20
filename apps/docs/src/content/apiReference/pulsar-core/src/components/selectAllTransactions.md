[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectAllTransactions()

> **selectAllTransactions**\<`TR`, `T`\>(`transactionsPool`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:16](https://github.com/TuwaIO/pulsar-core/blob/b0a80b70bc22baf2c706d161bdc4a093678b2647/packages/pulsar-core/src/store/transactionsSelectors.ts#L16)

Selects all transactions from the pool and sorts them by their creation timestamp.

## Type Parameters

### TR

`TR`

The type of the tracker identifier.

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

The transaction type.

## Parameters

### transactionsPool

[`TransactionPool`](../type-aliases/TransactionPool.md)\<`TR`, `T`\>

The entire pool of transactions from the store.

## Returns

`T`[]

An array of all transactions, sorted chronologically.
