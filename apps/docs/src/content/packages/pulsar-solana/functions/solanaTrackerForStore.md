# solanaTrackerForStore()

> **solanaTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [trackers/solanaTracker.ts:212](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L212)

Tracks a Solana transaction of the Pulsar store with [solanaFetcher](/packages/pulsar-solana/functions/solanaFetcher.md) (every 2.5 s, up to 10 consecutive RPC
errors) and writes the results to the store: `confirmations`, `slot`, `fee`, `instructions` and `recentBlockhash`
while pending, then `Success` with `confirmations: 'MAX'`, or `Failed` with the normalized error, and the local time
as `finishedTimestamp`.

When tracking gives up (10 consecutive RPC errors, or not finalized one hour after `localTimestamp`), the transaction
is marked `Failed` and stays in the pool. The callbacks receive the transaction with every update written by the
tracker; `onError` receives the on-chain error, or an `Error` when tracking timed out.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

`Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\>

The transaction, the store members and the callbacks.

## Returns

`Promise`\<`void`\>

A promise that resolves once polling has started.
