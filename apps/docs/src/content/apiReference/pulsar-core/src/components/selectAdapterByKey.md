[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectAdapterByKey()

> **selectAdapterByKey**\<`T`\>(`params`): `undefined` \| [`TxAdapter`](../type-aliases/TxAdapter.md)\<`T`\>

Defined in: [packages/pulsar-core/src/utils/selectAdapterByKey.ts:23](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/utils/selectAdapterByKey.ts#L23)

Selects a transaction adapter from a list based on a provided key.

This function searches through an array of `TxAdapter` instances and returns the one
that matches the given `adapterKey`. If no specific adapter is found, it logs a warning
and returns the first adapter in the array as a fallback. This fallback mechanism
ensures that the system can still function, but it highlights a potential configuration issue.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The transaction type, extending the base `Transaction`.

## Parameters

### params

`object` & `Pick`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>, `"adapter"`\>

The parameters for the selection.

## Returns

`undefined` \| [`TxAdapter`](../type-aliases/TxAdapter.md)\<`T`\>

The found transaction adapter, the fallback adapter, or undefined if the adapters array is empty.
