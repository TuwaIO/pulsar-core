[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createPulsarStore()

> **createPulsarStore**\<`T`\>(`__namedParameters`): `WithPersist`\<`StoreApi`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>\>

Defined in: [packages/pulsar-core/src/store/txTrackingStore.ts:31](https://github.com/TuwaIO/pulsar-core/blob/698c5eb23be9ded1ac04d2ceef0aaddf6f1229e1/packages/pulsar-core/src/store/txTrackingStore.ts#L31)

Creates the main Pulsar store for transaction tracking.

This function configures a Zustand store enhanced with persistence. It combines the core transaction management
slice with a powerful orchestration logic that leverages chain-specific adapters to handle the entire
lifecycle of a transaction—from initiation and chain validation to execution and background status tracking.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type, extending the base `Transaction`.

## Parameters

### \_\_namedParameters

[`Adapter`](../type-aliases/Adapter.md)\<`T`\> & `PersistOptions`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>, `unknown`\>

## Returns

`WithPersist`\<`StoreApi`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>\>

A fully configured Zustand store instance.
