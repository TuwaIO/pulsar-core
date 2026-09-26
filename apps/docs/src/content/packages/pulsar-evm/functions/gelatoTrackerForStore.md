# ~~gelatoTrackerForStore()~~

> **gelatoTrackerForStore**\<`T`\>(`params`): `void`

Defined in: [trackers/gelatoTracker.ts:171](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L171)

Tracks a Gelato task of the Pulsar store with [gelatoFetcher](/packages/pulsar-evm/functions/gelatoFetcher.md) (every 5 s, up to 10 consecutive failed
attempts) and writes the results to the store: the transaction `hash` once the task is submitted, then `Success` or
`Failed` with the local time as `finishedTimestamp`.

When tracking gives up (10 consecutive failed attempts, or the task still pending after one hour), the transaction
is marked `Failed` and stays in the pool.

Side effects: sends requests to the Gelato API with `gelatoApiKey` (see [createGelatoClient](/packages/pulsar-evm/functions/createGelatoClient.md)). The callbacks
receive the transaction with every update written by the tracker.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

`Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\>

The transaction, the Gelato API key, the store members and the callbacks.

## Returns

`void`

## Deprecated

Gelato relay is deprecated. Use `TransactionTracker.ERC4337` and [erc4337TrackerForStore](/packages/pulsar-evm/functions/erc4337TrackerForStore.md) instead.
