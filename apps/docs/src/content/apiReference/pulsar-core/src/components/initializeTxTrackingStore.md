[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# initializeTxTrackingStore()

> **initializeTxTrackingStore**\<`TR`, `T`, `A`\>(`options`): [`StoreSlice`](../type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`TR`, `T`, `A`\>\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:81](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L81)

Creates a Zustand store slice containing the core logic for transaction tracking.
This function is a slice creator and is meant to be used within `createStore` from Zustand.

## Type Parameters

### TR

`TR`

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

### A

`A`

## Parameters

### options

Configuration options for the store slice.

#### onSucceedCallbacks?

(`tx`) => `void` \| `Promise`\<`void`\>

An optional async callback to run when a transaction succeeds.

## Returns

[`StoreSlice`](../type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](../interfaces/IInitializeTxTrackingStore.md)\<`TR`, `T`, `A`\>\>

A Zustand store slice.
