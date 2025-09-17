[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createPulsarStore()

> **createPulsarStore**\<`TR`, `T`, `A`\>(`__namedParameters`): `WithPersist`\<`StoreApi`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>

Defined in: [packages/pulsar-core/src/store/txTrackingStore.ts:33](https://github.com/TuwaIO/pulsar-core/blob/f426f4bfc26016d7fbea4fd9c0d9ff73fe1677fe/packages/pulsar-core/src/store/txTrackingStore.ts#L33)

Creates the main Pulsar store for transaction tracking.

This function configures a Zustand store enhanced with persistence. It combines the core transaction management
slice with a powerful orchestration logic that leverages chain-specific adapters to handle the entire
lifecycle of a transaction—from initiation and chain validation to execution and background status tracking.

## Type Parameters

### TR

`TR`

The type of the tracker identifier (e.g., a string enum).

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

The specific transaction type, extending the base `Transaction`.

### A

`A`

The type of the key returned by the `actionFunction` (e.g., a transaction hash).

## Parameters

### \_\_namedParameters

`object` & `PersistOptions`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>, `unknown`\>

## Returns

`WithPersist`\<`StoreApi`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>

A fully configured Zustand store instance.
