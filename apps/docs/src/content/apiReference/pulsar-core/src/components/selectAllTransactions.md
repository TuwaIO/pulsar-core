[**API Reference.**](../../../README.md)

***

# selectAllTransactions()

> **selectAllTransactions**\<`T`\>(`transactionsPool`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:14](https://github.com/TuwaIO/pulsar-core/blob/04262b00f797406a8a57df5eb1e0a1258d30caf9/packages/pulsar-core/src/store/transactionsSelectors.ts#L14)

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
