[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectPendingTransactionsByActiveWallet()

> **selectPendingTransactionsByActiveWallet**\<`T`\>(`transactionsPool`, `from`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:64](https://github.com/TuwaIO/pulsar-core/blob/7d4bdc3c91c53bb25d41d74c9edaaffd57d4789d/packages/pulsar-core/src/store/transactionsSelectors.ts#L64)

Selects all pending transactions for a specific wallet address, sorted chronologically.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The transaction type.

## Parameters

### transactionsPool

[`TransactionPool`](../type-aliases/TransactionPool.md)\<`T`\>

The entire transaction pool from the store.

### from

`string`

The wallet address (`from` address) to filter transactions by.

## Returns

`T`[]

An array of pending transactions for the given wallet.
