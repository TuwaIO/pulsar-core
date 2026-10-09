# InitializeTrackerParams\<T\>

> **InitializeTrackerParams**\<`T`\> = `Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\>

Defined in: [utils/checkAndInitializeTrackerInStore.ts:19](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/checkAndInitializeTrackerInStore.ts#L19)

The parameters of [checkAndInitializeTrackerInStore](/packages/pulsar-evm/functions/checkAndInitializeTrackerInStore.md).

## Type Declaration

### config

> **config**: `Config`

The wagmi config of the app.

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

#### Deprecated

Gelato API key; required to run the Gelato tracker.

### tracker

> **tracker**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

The tracker to run, usually `tx.tracker`.

### tx

> **tx**: `T`

The transaction to track.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.
