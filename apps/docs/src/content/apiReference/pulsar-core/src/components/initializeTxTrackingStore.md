[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# initializeTxTrackingStore()

> **initializeTxTrackingStore**\<`T`\>(`options`): [`StoreSlice`](../type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`T`\>\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:19](https://github.com/TuwaIO/pulsar-core/blob/3776e8cceb12ffbe5dc480169b68929e67178ab8/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L19)

Creates a Zustand store slice with the core logic for transaction state management.
This function is a slice creator intended for use with Zustand's `create` function.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type.

## Parameters

### options

`Pick`\<[`PulsarAdapter`](../type-aliases/PulsarAdapter.md)\<`T`\>, `"onRemoteCreate"`\> & `object`

Configuration for the store slice.

## Returns

[`StoreSlice`](../type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`T`\>\>

A Zustand store slice implementing `IInitializeTxTrackingStore`.
