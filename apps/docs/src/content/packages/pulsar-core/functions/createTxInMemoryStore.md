# createTxInMemoryStore()

> **createTxInMemoryStore**\<`T`\>(`params`): `StoreApi`\<[`ITxInMemoryStore`](/packages/pulsar-core/type-aliases/ITxInMemoryStore.md)\<`T`\>\>

Defined in: [store/txInMemoryStore.ts:119](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/store/txInMemoryStore.ts#L119)

Creates an in-memory store that shows the remote transaction history of a wallet (for example from Quasar) together
with the local pool of the persistent store. Nothing in it is persisted. Keep it in sync with the persistent store by
calling `syncWithLocalPool` from that store's `subscribe` listener.

Merge rules: a transaction that is `Success` or `Replaced` in memory is never overwritten; a pending one is
overwritten only by a terminal transaction or by one with more confirmations; any other one is overwritten.

History pages are validated like `injectExternalPendingTxs` does: transactions whose title, description or payload
break the safety limits are skipped with a warning and are not passed to `onHistoryFetched`.

Side effects: `fetchInitial` and `fetchNextPage` call `getHistory`, usually a network request. The store uses its
own Immer instance without auto-freeze and does not change the global Immer configuration.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

[`ITxInMemoryStoreParameters`](/packages/pulsar-core/type-aliases/ITxInMemoryStoreParameters.md)\<`T`\>

The store configuration.

## Returns

`StoreApi`\<[`ITxInMemoryStore`](/packages/pulsar-core/type-aliases/ITxInMemoryStore.md)\<`T`\>\>

A vanilla Zustand store; bind it to React with `createBoundedUseStore`.
