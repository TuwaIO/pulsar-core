[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# initializeTxTrackingStore()

> **initializeTxTrackingStore**\<`T`\>(): [`StoreSlice`](../type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`T`\>\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:18](https://github.com/TuwaIO/pulsar-core/blob/f5616ba252d697b2c43f276476e16334b931915b/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L18)

Creates a Zustand store slice with the core logic for transaction state management.
This function is a slice creator intended for use with Zustand's `create` function.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type.

## Returns

[`StoreSlice`](../type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`T`\>\>

A Zustand store slice implementing `IInitializeTxTrackingStore`.
