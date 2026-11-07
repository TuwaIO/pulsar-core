# createPulsarStore()

> **createPulsarStore**\<`T`\>(`params`): `WithPersist`\<`StoreApi`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>\>, [`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>\>

Defined in: [packages/pulsar-core/src/store/txTrackingStore.ts:96](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/store/txTrackingStore.ts#L96)

Creates the Pulsar transaction store: a vanilla Zustand store (use it from any framework, or bind it to React with
`createBoundedUseStore`) that runs transactions through chain adapters and tracks them in the background.

Side effects: the state is saved with Zustand's `persist` middleware under the key `name`, by default in
`localStorage`, on every change: `transactionsPool`, `lastAddedTxKey` and `unsyncedTxKeys`. A finished transaction
is kept for `retentionDays` (30 by default) and at most `maxTransactions` are kept. `initialTx` is neither
saved nor restored (pass your own `partialize` and `merge` to change that). In the browser the saved state is
restored synchronously when the store is created. Where
`localStorage` is not available (server rendering), nothing is read or written and Zustand logs a warning on
updates. Creating the store starts no tracker: call `initializeTransactionsPool` on the client. Later, a storage event
starts trackers for the pending transactions of another tab, which means RPC requests from this tab too.
In the browser it listens to `storage` events and merges what another tab has saved, by transaction, into this tab's
pool, and it tracks the pending transactions it learns that way, so a closed tab leaves nothing unfinished. Every
transaction gets one tracker, however often `initializeTransactionsPool` runs. A speed-up made in the wallet or through
`speedUpTxAction` continues in a new record: the old one ends as `Replaced`, and a new one under the new hash, linked by
`replaces`, goes on to the result with the same callbacks.
`removeTxFromPool` writes the key to `localStorage` under `${name}:removedTxKeys` (the latest 50), so that neither a page load, a
history of a server nor another tab brings the transaction back, and the other tabs let go of it. Sending the same key anew
clears it.

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
