# safeTrackerForStore()

> **safeTrackerForStore**\<`T`\>(`params`): `void`

Defined in: [trackers/safeTracker.ts:267](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L267)

Tracks a Safe multisig transaction of the Pulsar store with [createSafeFetcher](/packages/pulsar-evm/functions/createSafeFetcher.md) ([safePollingInterval](/packages/pulsar-evm/functions/safePollingInterval.md):
every 5 s for the first hour, then every 30 s) and writes the results to the
store: while it waits, the owner confirmations collected (`confirmations`) and the Safe threshold
(`requiredConfirmations`) and the executed transaction `hash`; then `Success`, `Failed` or `Replaced` (with the
`safeTxHash` of the executed transaction as `replacedTxHash`) and the execution date as `finishedTimestamp`.

A service that cannot be reached says nothing about the Safe: after 10 consecutive failed attempts it keeps asking every
minute. Tracking gives up on a 404 that lasts 10 minutes, or when the transaction is still pending `pendingTimeoutMs`
after it was proposed (no limit by default); the transaction is then marked `Failed` with an error that says why, and it
stays in the pool.

Side effects: sends requests to the Safe Transaction Service. The callbacks receive the transaction with every update
written by the tracker.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

`Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `Partial`\<`Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"isTxTracked"`\>\> & `object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\> & [`SafeTrackerOptions`](/packages/pulsar-evm/type-aliases/SafeTrackerOptions.md)

The transaction, the store members and the callbacks.

## Returns

`void`
