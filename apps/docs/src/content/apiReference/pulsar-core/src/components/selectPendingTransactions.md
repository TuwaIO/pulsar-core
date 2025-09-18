[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectPendingTransactions()

> **selectPendingTransactions**\<`T`\>(`transactionsPool`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:25](https://github.com/TuwaIO/pulsar-core/blob/227594b111c3b7431fc1b2bfe3380cc9ee0fa156/packages/pulsar-core/src/store/transactionsSelectors.ts#L25)

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
