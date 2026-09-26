# selectPendingTransactions()

> **selectPendingTransactions**\<`T`\>(`transactionsPool`): `T`[]

Defined in: [store/transactionsSelectors.ts:26](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/store/transactionsSelectors.ts#L26)

Returns the transactions with `pending: true`, oldest first.

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

A new array of pending transactions, sorted chronologically.
