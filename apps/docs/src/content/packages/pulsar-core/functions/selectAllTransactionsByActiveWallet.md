# selectAllTransactionsByActiveWallet()

> **selectAllTransactionsByActiveWallet**\<`T`\>(`transactionsPool`, `from`): `T`[]

Defined in: [store/transactionsSelectors.ts:53](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/store/transactionsSelectors.ts#L53)

Returns the transactions sent by a wallet, oldest first. Addresses are compared case-insensitively.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### transactionsPool

[`TransactionPool`](/packages/pulsar-core/type-aliases/TransactionPool.md)\<`T`\>

The transaction pool of the store.

### from

`string`

The wallet address to match against the `from` field.

## Returns

`T`[]

A new array of the wallet's transactions, sorted chronologically.
