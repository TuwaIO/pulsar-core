[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectPendingTransactions()

> **selectPendingTransactions**\<`T`\>(`transactionsPool`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:24](https://github.com/TuwaIO/pulsar-core/blob/60bbca9feab340b4bac58012b93caa368d33efe5/packages/pulsar-core/src/store/transactionsSelectors.ts#L24)

Selects all transactions that are currently in a pending state, sorted chronologically.

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

An array of pending transactions.
