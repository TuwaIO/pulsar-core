# Erc4337TrackerForStoreParams\<T\>

> **Erc4337TrackerForStoreParams**\<`T`\> = `Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\>

Defined in: [trackers/erc4337Tracker.ts:221](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L221)

The parameters of [erc4337TrackerForStore](/packages/pulsar-evm/functions/erc4337TrackerForStore.md): the transaction, an optional wagmi config, the store members used
by trackers and the callbacks.

## Type Declaration

### config?

> `optional` **config?**: `Config`

The wagmi config, used for the on-chain stage. Without it, the transaction succeeds as soon as it is bundled.

### tx

> **tx**: `T`

The transaction to track; `txKey` is the `userOpHash`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.
