[**API Reference.**](../../../README.md)

***

# selectTxByKey()

> **selectTxByKey**\<`T`\>(`transactionsPool`, `key`): `T` \| `undefined`

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:35](https://github.com/TuwaIO/pulsar-core/blob/6a829cc584a4473ad994020ccbe6fa99848e8820/packages/pulsar-core/src/store/transactionsSelectors.ts#L35)

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
