[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectAllTransactions()

> **selectAllTransactions**\<`T`\>(`transactionsPool`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:15](https://github.com/TuwaIO/pulsar-core/blob/3ba2d01231ada5db5bd141e51fda8a3427ad1f9d/packages/pulsar-core/src/store/transactionsSelectors.ts#L15)

Selects all transactions from the pool and sorts them by their creation timestamp in ascending order.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The transaction type.

## Parameters

### transactionsPool

[`TransactionPool`](../type-aliases/TransactionPool.md)\<`T`\>

The entire transaction pool from the store.

## Returns

`T`[]

An array of all transactions, sorted chronologically.
