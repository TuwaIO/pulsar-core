# createTxInMemoryStore()

> **createTxInMemoryStore**\<`T`\>(`params`): `StoreApi`\<[`ITxInMemoryStore`](/packages/pulsar-core/type-aliases/ITxInMemoryStore.md)\<`T`\>\>

Defined in: [packages/pulsar-core/src/store/txInMemoryStore.ts:145](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/store/txInMemoryStore.ts#L145)

Creates an in-memory store that shows the remote transaction history of a wallet (for example from Quasar) together
with the local pool of the persistent store. Nothing in it is persisted. Keep it in sync with the persistent store by
calling `syncWithLocalPool` from that store's `subscribe` listener.

Merge rules: a transaction that is `Success` or `Replaced` in memory is never overwritten, and a `Failed` one only by
`Success` or `Replaced`, as a server's `Failed` may be its own time limit. A pending one is overwritten by a record of the
local pool, and by a remote one with a result or more confirmations; a remote `Failed`, or a remote `Replaced` with no
`replacedReason`, leaves it pending until its tracker answers. Any other one is overwritten.

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
