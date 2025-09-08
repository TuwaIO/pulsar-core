[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectAdapterByKey()

> **selectAdapterByKey**\<`TR`, `T`, `A`\>(`params`): [`TxAdapter`](../type-aliases/TxAdapter.md)\<`TR`, `T`, `A`\>

Defined in: [packages/pulsar-core/src/utils/selectAdapterByKey.ts:17](https://github.com/TuwaIO/pulsar-core/blob/815bc21285ae9bacc614d9409dbf8732e5b5c450/packages/pulsar-core/src/utils/selectAdapterByKey.ts#L17)

Selects and returns a transaction adapter from a list of adapters based on the provided adapter key.
If no matching adapter is found, the first adapter in the list is returned as a fallback.

## Type Parameters

### TR

`TR`

Represents the transaction response type.

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

Extends the Transaction type and represents the transaction entity.

### A

`A`

Represents the adapter type.

## Parameters

### params

Configuration object for selecting the adapter.

#### adapterKey

[`TransactionAdapter`](../enumerations/TransactionAdapter.md)

The key used to identify the desired transaction adapter.

#### adapters

[`TxAdapter`](../type-aliases/TxAdapter.md)\<`TR`, `T`, `A`\>[]

An array of available transaction adapters.

## Returns

[`TxAdapter`](../type-aliases/TxAdapter.md)\<`TR`, `T`, `A`\>

The transaction adapter corresponding to the provided key, or the first adapter in the list.
