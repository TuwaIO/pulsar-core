[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectTxByKey()

> **selectTxByKey**\<`TR`, `T`\>(`transactionsPool`, `key`): `undefined` \| `T`

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:41](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-core/src/store/transactionsSelectors.ts#L41)

Selects a single transaction from the pool by its unique key (`txKey`).

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

### key

`string`

The `txKey` of the transaction to retrieve.

## Returns

`undefined` \| `T`

The transaction object if found, otherwise undefined.
