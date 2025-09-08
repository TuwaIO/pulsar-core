[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectAllTransactionsByActiveWallet()

> **selectAllTransactionsByActiveWallet**\<`TR`, `T`\>(`transactionsPool`, `from`): `T`[]

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:57](https://github.com/TuwaIO/pulsar-core/blob/98e433e0b5469717bae47a7476c9ed01c1e7d3df/packages/pulsar-core/src/store/transactionsSelectors.ts#L57)

Selects all transactions initiated by a specific wallet address.

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

### from

`string`

The wallet address (`from` address) to filter transactions by.

## Returns

`T`[]

An array of transactions associated with the given wallet.
