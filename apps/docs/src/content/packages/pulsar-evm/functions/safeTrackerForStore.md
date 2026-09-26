# safeTrackerForStore()

> **safeTrackerForStore**\<`T`\>(`params`): `void`

Defined in: [trackers/safeTracker.ts:165](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L165)

Tracks a Safe multisig transaction of the Pulsar store with [safeFetcher](/packages/pulsar-evm/functions/safeFetcher.md) (every 5 s, up to 10 consecutive
failed attempts) and writes the results to the store: the executed transaction `hash`, then `Success`, `Failed` or
`Replaced` (with the `safeTxHash` of the executed transaction as `replacedTxHash`) and the execution date as
`finishedTimestamp`.

When tracking gives up (10 consecutive failed attempts, a 404 response, or still pending one day after it was
proposed), the transaction is marked `Failed` with an error that says why, and it stays in the pool.

Side effects: sends requests to the Safe Transaction Service. The callbacks receive the transaction with every update
written by the tracker.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

`Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\>

The transaction, the store members and the callbacks.

## Returns

`void`
