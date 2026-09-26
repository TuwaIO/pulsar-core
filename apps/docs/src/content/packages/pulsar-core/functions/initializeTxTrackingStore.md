# initializeTxTrackingStore()

> **initializeTxTrackingStore**\<`T`\>(`params`): [`StoreSlice`](/packages/pulsar-core/type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](/packages/pulsar-core/interfaces/IInitializeTxTrackingStore.md)\<`T`\>\>

Defined in: [store/initializeTxTrackingStore.ts:39](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L39)

Creates the core slice of the transaction store: `transactionsPool`, `initialTx`, `unsyncedTxKeys` and the actions
that change them. `createPulsarStore` uses it; call it directly only to compose a custom Zustand store.

The slice keeps its state in memory; persistence is added by the store that uses it.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

`Pick`\<[`PulsarAdapter`](/packages/pulsar-core/type-aliases/PulsarAdapter.md)\<`T`\>, `"onRemoteCreate"`\> & `object`

The slice options.

## Returns

[`StoreSlice`](/packages/pulsar-core/type-aliases/StoreSlice.md)\<[`IInitializeTxTrackingStore`](/packages/pulsar-core/interfaces/IInitializeTxTrackingStore.md)\<`T`\>\>

A slice creator for Zustand's `create` / `createStore`.
