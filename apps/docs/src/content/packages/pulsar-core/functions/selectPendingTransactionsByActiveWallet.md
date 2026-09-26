# selectPendingTransactionsByActiveWallet()

> **selectPendingTransactionsByActiveWallet**\<`T`\>(`transactionsPool`, `from`): `T`[]

Defined in: [store/transactionsSelectors.ts:69](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/store/transactionsSelectors.ts#L69)

Returns the pending transactions sent by a wallet, oldest first. Addresses are compared case-insensitively.

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

A new array of the wallet's pending transactions, sorted chronologically.
