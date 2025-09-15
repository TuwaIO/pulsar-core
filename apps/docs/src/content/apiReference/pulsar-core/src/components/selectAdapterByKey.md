[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectAdapterByKey()

> **selectAdapterByKey**\<`TR`, `T`, `A`\>(`params`): `undefined` \| [`TxAdapter`](../type-aliases/TxAdapter.md)\<`TR`, `T`, `A`\>

Defined in: [packages/pulsar-core/src/utils/selectAdapterByKey.ts:25](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/utils/selectAdapterByKey.ts#L25)

Selects a transaction adapter from a list based on a provided key.

This function searches through an array of `TxAdapter` instances and returns the one
that matches the given `adapterKey`. If no specific adapter is found, it logs a warning
and returns the first adapter in the array as a fallback. This fallback mechanism
ensures that the system can still function, but it highlights a potential configuration issue.

## Type Parameters

### TR

`TR`

The type of the tracker identifier.

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

The transaction type, extending the base `Transaction`.

### A

`A`

The type for the adapter-specific context or API.

## Parameters

### params

The parameters for the selection.

#### adapterKey

[`TransactionAdapter`](../enumerations/TransactionAdapter.md)

The key of the desired adapter.

#### adapters

[`TxAdapter`](../type-aliases/TxAdapter.md)\<`TR`, `T`, `A`\>[]

An array of available transaction adapters.

## Returns

`undefined` \| [`TxAdapter`](../type-aliases/TxAdapter.md)\<`TR`, `T`, `A`\>

The found transaction adapter, the fallback adapter, or undefined if the adapters array is empty.
