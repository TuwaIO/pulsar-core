[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectAllTransactionsByActiveWallet()

> **selectAllTransactionsByActiveWallet**\<`T`\>(`transactionsPool`, `from`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:49](https://github.com/TuwaIO/pulsar-core/blob/151441c712d4a6c33418d0a4cfc861ba6f254bbd/packages/pulsar-core/src/store/transactionsSelectors.ts#L49)

Selects all transactions initiated by a specific wallet address, sorted chronologically.

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

An array of transactions associated with the given wallet.
