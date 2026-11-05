# InitializeTrackerParams\<T\>

> **InitializeTrackerParams**\<`T`\> = `Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `Partial`\<`Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"isTxTracked"`\>\> & `object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\>

Defined in: [utils/checkAndInitializeTrackerInStore.ts:19](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/checkAndInitializeTrackerInStore.ts#L19)

The parameters of [checkAndInitializeTrackerInStore](/packages/pulsar-evm/functions/checkAndInitializeTrackerInStore.md).

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Type Declaration

### config

> **config**: `Config`

The wagmi config of the app.

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

#### Deprecated

Gelato API key; required to run the Gelato tracker.

### safePendingTimeoutMs?

> `optional` **safePendingTimeoutMs?**: `number` \| `null`

How long a Safe transaction may stay unexecuted before the Safe tracker gives up (see `SafeTrackerOptions`); `null`
waits without a limit, the default, as collecting the signatures of several owners can take days.

### tracker

> **tracker**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

The tracker to run, usually `tx.tracker`.

### tx

> **tx**: `T`

The transaction to track.
