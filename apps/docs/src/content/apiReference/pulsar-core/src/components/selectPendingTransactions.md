[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectPendingTransactions()

> **selectPendingTransactions**\<`TR`, `T`\>(`transactionsPool`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:27](https://github.com/TuwaIO/pulsar-core/blob/ea066c8cd65e6c1227300bf48fc7dcb6a33a8ab8/packages/pulsar-core/src/store/transactionsSelectors.ts#L27)

Selects all transactions that are currently in a pending state.

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

An array of pending transactions.
