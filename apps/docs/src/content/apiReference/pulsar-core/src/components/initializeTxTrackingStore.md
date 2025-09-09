[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# initializeTxTrackingStore()

> **initializeTxTrackingStore**\<`TR`, `T`\>(`options`): [`StoreSlice`](../type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`TR`, `T`\>\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:78](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L78)

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

[`StoreSlice`](../type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`TR`, `T`\>\>

A Zustand store slice.
