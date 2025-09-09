[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectAllTransactionsByActiveWallet()

> **selectAllTransactionsByActiveWallet**\<`TR`, `T`\>(`transactionsPool`, `from`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:56](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-core/src/store/transactionsSelectors.ts#L56)

Selects all transactions initiated by a specific wallet address, sorted chronologically.

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

An array of transactions associated with the given wallet.
