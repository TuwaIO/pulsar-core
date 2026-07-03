[**API Reference.**](../../../README.md)

***

# selectTxByKey()

> **selectTxByKey**\<`T`\>(`transactionsPool`, `key`): `T` \| `undefined`

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:35](https://github.com/TuwaIO/pulsar-core/blob/b07dd22051bc55774d8350cd6e66a57ea987b080/packages/pulsar-core/src/store/transactionsSelectors.ts#L35)

Selects a single transaction from the pool by its unique key (`txKey`).

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The transaction type.

## Parameters

### transactionsPool

[`TransactionPool`](../type-aliases/TransactionPool.md)\<`T`\>

The entire transaction pool from the store.

### key

`string`

The `txKey` of the transaction to retrieve.

## Returns

`T` \| `undefined`

The transaction object if found, otherwise undefined.
