[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# initializeTxTrackingStore()

> **initializeTxTrackingStore**\<`TR`, `T`\>(`options`): [`StoreSlice`](../type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](../type-aliases/IInitializeTxTrackingStore.md)\<`TR`, `T`\>\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:76](https://github.com/TuwaIO/pulsar-core/blob/331a7d5f292c7c39ecb210370af8d2ac8b40c273/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L76)

Creates a Zustand store slice containing the core logic for transaction tracking.
This function is a slice creator and is meant to be used within `createStore` from Zustand.

## Type Parameters

### TR

`TR`

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

## Parameters

### options

Configuration options for the store slice.

#### onSucceedCallbacks?

(`tx`) => `void` \| `Promise`\<`void`\>

An optional async callback to run when a transaction succeeds.

## Returns

[`StoreSlice`](../type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](../type-aliases/IInitializeTxTrackingStore.md)\<`TR`, `T`\>\>

A Zustand store slice.
