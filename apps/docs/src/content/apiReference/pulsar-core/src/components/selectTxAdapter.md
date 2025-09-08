[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectTxAdapter()

> **selectTxAdapter**\<`TR`, `T`, `A`\>(`params`): [`TxAdapter`](../type-aliases/TxAdapter.md)\<`TR`, `T`, `A`\>

Defined in: [packages/pulsar-core/src/utils/selectTxAdapter.ts:15](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/utils/selectTxAdapter.ts#L15)

Finds and returns the appropriate transaction adapter for a given transaction based on the adapter key.

## Type Parameters

### TR

`TR`

The type representing the transaction result or payload.

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

The type of the transaction which extends the base Transaction type.

### A

`A`

The type of additional properties or methods in the adapter.

## Parameters

### params

The input parameters.

#### adapters

[`TxAdapter`](../type-aliases/TxAdapter.md)\<`TR`, `T`, `A`\>[]

An array of available transaction adapters, each with a unique key.

#### tx

`T`

The transaction object which includes the adapter key to be matched.

## Returns

[`TxAdapter`](../type-aliases/TxAdapter.md)\<`TR`, `T`, `A`\>

The transaction adapter matching the transaction's `adapter` key, or the first adapter in the array if no match is found.
