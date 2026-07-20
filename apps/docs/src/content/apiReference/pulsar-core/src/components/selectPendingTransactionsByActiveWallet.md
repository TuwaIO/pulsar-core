[**API Reference.**](../../../README.md)

***

# selectPendingTransactionsByActiveWallet()

> **selectPendingTransactionsByActiveWallet**\<`T`\>(`transactionsPool`, `from`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:64](https://github.com/TuwaIO/pulsar-core/blob/7537cc09a326a69451e7718b6995858cbe2f63a0/packages/pulsar-core/src/store/transactionsSelectors.ts#L64)

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
