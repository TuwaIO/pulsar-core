[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createPulsarStore()

> **createPulsarStore**\<`TR`, `T`, `A`\>(`__namedParameters`): `WithPersist`\<`StoreApi`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>

Defined in: [packages/pulsar-core/src/store/txTrackingStore.ts:34](https://github.com/TuwaIO/pulsar-core/blob/494f4105ae0c6206b7fb474bf50e2b00399fd8c0/packages/pulsar-core/src/store/txTrackingStore.ts#L34)

Creates the main Pulsar store for transaction tracking.

This function sets up a Zustand store with persistence, combining the core
transaction slice with adapter-specific logic to handle the entire lifecycle
of a transaction.

## Type Parameters

### TR

`TR`

The type of the tracker identifier (e.g., a string enum).

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)\<`TR`\>

The specific transaction type, extending the base `Transaction`.

### A

`A`

The type for the adapter-specific context or API.

## Parameters

### \_\_namedParameters

`object` & `PersistOptions`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>, `unknown`\>

## Returns

`WithPersist`\<`StoreApi`\<[`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>, [`ITxTrackingStore`](../type-aliases/ITxTrackingStore.md)\<`TR`, `T`, `A`\>\>

A fully configured Zustand store instance.
