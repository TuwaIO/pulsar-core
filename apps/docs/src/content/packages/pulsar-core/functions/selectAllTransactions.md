# selectAllTransactions()

> **selectAllTransactions**\<`T`\>(`transactionsPool`): `T`[]

Defined in: [store/transactionsSelectors.ts:15](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/store/transactionsSelectors.ts#L15)

Returns every transaction of the pool, oldest first (by `localTimestamp`).

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### transactionsPool

[`TransactionPool`](/packages/pulsar-core/type-aliases/TransactionPool.md)\<`T`\>

The transaction pool of the store.

## Returns

`T`[]

A new array of all transactions, sorted chronologically.
