# selectTxByKey()

> **selectTxByKey**\<`T`\>(`transactionsPool`, `key`): `T` \| `undefined`

Defined in: [store/transactionsSelectors.ts:38](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/store/transactionsSelectors.ts#L38)

Returns the transaction stored under a `txKey`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### transactionsPool

[`TransactionPool`](/packages/pulsar-core/type-aliases/TransactionPool.md)\<`T`\>

The transaction pool of the store.

### key

`string`

The `txKey` of the transaction.

## Returns

`T` \| `undefined`

The transaction, or `undefined` if the pool has no such key.
