# Eip5792TrackerForStoreParams\<T\>

> **Eip5792TrackerForStoreParams**\<`T`\> = `Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\>

Defined in: [trackers/eip5792Tracker.ts:163](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L163)

The parameters of [eip5792TrackerForStore](/packages/pulsar-evm/functions/eip5792TrackerForStore.md): the transaction, the wagmi config, the store members used by
trackers and the callbacks.

## Type Declaration

### config

> **config**: `Config`

The wagmi config with the wallet that sent the batch; also used for the on-chain stage.

### tx

> **tx**: `T`

The transaction to track; `txKey` is the batch ID returned by `wallet_sendCalls`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.
