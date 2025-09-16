[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectPendingTransactionsByActiveWallet()

> **selectPendingTransactionsByActiveWallet**\<`TR`, `T`\>(`transactionsPool`, `from`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:72](https://github.com/TuwaIO/pulsar-core/blob/c3ad8144f2008a57a67fac346389a8c64145db47/packages/pulsar-core/src/store/transactionsSelectors.ts#L72)

Selects all pending transactions for a specific wallet address, sorted chronologically.

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

The entire transaction pool from the store.

### from

`string`

The wallet address (`from` address) to filter transactions by.

## Returns

`T`[]

An array of pending transactions for the given wallet.
