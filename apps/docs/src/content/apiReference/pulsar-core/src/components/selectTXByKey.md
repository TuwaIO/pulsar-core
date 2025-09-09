[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectTxByKey()

> **selectTxByKey**\<`TR`, `T`\>(`transactionsPool`, `key`): `undefined` \| `T`

Defined in: [packages/pulsar-core/src/store/transactionsSelectors.ts:41](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-core/src/store/transactionsSelectors.ts#L41)

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
