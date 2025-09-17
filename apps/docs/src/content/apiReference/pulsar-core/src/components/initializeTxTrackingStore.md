[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# initializeTxTrackingStore()

> **initializeTxTrackingStore**\<`TR`, `T`, `A`\>(`options`): [`StoreSlice`](../type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`TR`, `T`, `A`\>\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:87](https://github.com/TuwaIO/pulsar-core/blob/f426f4bfc26016d7fbea4fd9c0d9ff73fe1677fe/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L87)

Creates a Zustand store slice with the core logic for transaction state management.
This function is a slice creator intended for use with Zustand's `create` function.

## Type Parameters

### TR

`TR`

The type of the tracker identifier.

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

The specific transaction type.

### A

`A`

The return type of the initial action function.

## Parameters

### options

Configuration for the store slice.

#### onSucceedCallbacks?

(`tx`) => `void` \| `Promise`\<`void`\>

An optional async callback to run when a transaction succeeds.

## Returns

[`StoreSlice`](../type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`TR`, `T`, `A`\>\>

A Zustand store slice implementing `IInitializeTxTrackingStore`.
