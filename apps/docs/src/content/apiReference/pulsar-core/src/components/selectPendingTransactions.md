[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectPendingTransactions()

> **selectPendingTransactions**\<`T`\>(`transactionsPool`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:24](https://github.com/TuwaIO/pulsar-core/blob/9d83f46f867bbea3f81e6947ce61a590010ce7a2/packages/pulsar-core/src/store/transactionsSelectors.ts#L24)

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
