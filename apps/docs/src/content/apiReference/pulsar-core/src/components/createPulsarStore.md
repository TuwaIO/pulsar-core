[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createPulsarStore()

> **createPulsarStore**\<`T`\>(`config`): `WithPersist`\<`StoreApi`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>\>

Defined in: [packages/pulsar-core/src/store/txTrackingStore.ts:30](https://github.com/TuwaIO/pulsar-core/blob/8895bf71b1b1e58aede9d79e7157d8533152d936/packages/pulsar-core/src/store/txTrackingStore.ts#L30)

Creates the main Pulsar store for transaction tracking.

This function configures a Zustand store enhanced with persistence. It combines the core transaction management
slice with a powerful orchestration logic that leverages chain-specific adapters to handle the entire
lifecycle of a transaction—from initiation and chain validation to execution and background status tracking.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The specific transaction type, extending the base `Transaction`.

## Parameters

### config

`OrbitGenericAdapter`\<[`TxAdapter`](../type-aliases/TxAdapter.md)\<`T`\>\> & `object` & `PersistOptions`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>, `unknown`\>

Configuration object for creating the store.

## Returns

`WithPersist`\<`StoreApi`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`T`\>\>

A fully configured Zustand store instance.
