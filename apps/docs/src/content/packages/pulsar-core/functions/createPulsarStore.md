# createPulsarStore()

> **createPulsarStore**\<`T`\>(`params`): `WithPersist`\<`StoreApi`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>\>, [`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>\>

Defined in: [store/txTrackingStore.ts:50](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/store/txTrackingStore.ts#L50)

Creates the Pulsar transaction store: a vanilla Zustand store (use it from any framework, or bind it to React with
`createBoundedUseStore`) that runs transactions through chain adapters and tracks them in the background.

Side effects: the state is saved with Zustand's `persist` middleware under the key `name`, by default in
`localStorage`, on every change: `transactionsPool`, `lastAddedTxKey` and `unsyncedTxKeys`. `initialTx` is neither
saved nor restored (pass your own `partialize` and `merge` to change that). In the browser the saved state is
restored synchronously when the store is created. Where
`localStorage` is not available (server rendering), nothing is read or written and Zustand logs a warning on
updates. Creating the store does not start any tracker: call `initializeTransactionsPool` once on the client.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

`OrbitGenericAdapter`\<[`TxAdapter`](/packages/pulsar-core/type-aliases/TxAdapter.md)\<`T`\>\> & `object` & [`SyncCallbacks`](/packages/pulsar-core/interfaces/SyncCallbacks.md)\<`T`\> & `PersistOptions`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, [`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `unknown`\>

The adapters, the store options and the options of Zustand's `persist` middleware.

## Returns

`WithPersist`\<`StoreApi`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>\>, [`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>\>

The vanilla Zustand store. `store.persist` exposes the `persist` API (for example `clearStorage()`).

## Example

```ts
import { createPulsarStore } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';

export const pulsarStore = createPulsarStore({
  name: 'transactions-tracking-storage',
  adapter: pulsarEvmAdapter(wagmiConfig, appChains),
});
```
