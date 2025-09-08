[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectAllTransactions()

> **selectAllTransactions**\<`TR`, `T`\>(`transactionsPool`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:16](https://github.com/TuwaIO/pulsar-core/blob/98e433e0b5469717bae47a7476c9ed01c1e7d3df/packages/pulsar-core/src/store/transactionsSelectors.ts#L16)

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
