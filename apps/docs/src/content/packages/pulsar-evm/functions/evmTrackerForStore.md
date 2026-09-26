# evmTrackerForStore()

> **evmTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [trackers/evmTracker.ts:300](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L300)

Runs [evmTracker](/packages/pulsar-evm/functions/evmTracker.md) for a transaction of the Pulsar store and writes the results to it through
`updateTxParams`: `hash` at start, the transaction details, `confirmations`, and finally `status` `Success`/`Failed`
with `pending: false` and the block timestamp, `Replaced` with `replacedTxHash`, or `Failed` with the normalized
error. The transaction is never removed from the pool.

The callbacks receive the transaction with every update written by the tracker (`createTxUpdater` from
`@tuwaio/pulsar-core`). A reverted transaction calls `onError` with `Error('Transaction reverted')`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

`Pick`\<[`EVMTrackerParams`](/packages/pulsar-evm/type-aliases/EVMTrackerParams.md), `"config"`\> & `Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"transactionsPool"`\> & `object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\>

The transaction, the wagmi config, the store members and the callbacks.

## Returns

`Promise`\<`void`\>

A promise that resolves when tracking has finished.
