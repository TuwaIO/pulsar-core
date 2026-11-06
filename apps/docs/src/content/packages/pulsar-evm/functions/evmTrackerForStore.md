# evmTrackerForStore()

> **evmTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [trackers/evmTracker.ts:540](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L540)

Runs [evmTracker](/packages/pulsar-evm/functions/evmTracker.md) for a transaction of the Pulsar store and writes the results to it through
`updateTxParams`: the on-chain sender and the other details at start, `confirmations`, and finally `status`
`Success`/`Failed` with `pending: false` and the block timestamp, or `Replaced` with `replacedTxHash` and
`replacedReason`. The transaction is never removed from the pool. After a speed-up (`repriced`) `createPulsarStore` adds a
new record that tracks the new hash to its own result. Another transaction in the nonce that reverted is `Replaced` with
`isError: true`.

Time alone never means `Failed`: the transaction stays `pending` until it has a receipt or its nonce is spent, as in a
wallet. A reload reads the saved sender and nonce, so a replacement that landed meanwhile is found. A nonce spent by a
transaction that cannot be found is `Replaced` with `replacedReason: 'unknown'`. Only a hash that no node has ever shown,
with nothing saved to read instead, fails: 24 hours after `localTimestamp`.

The callbacks receive the transaction with every update written by the tracker (`createTxUpdater` from
`@tuwaio/pulsar-core`). A reverted transaction calls `onError` with `Error('Transaction reverted')`. An error thrown
by a callback is logged and does not change the status.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

`Pick`\<[`EVMTrackerParams`](/packages/pulsar-evm/type-aliases/EVMTrackerParams.md), `"config"`\> & `Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"transactionsPool"`\> & `Partial`\<`Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"isTxTracked"`\>\> & `object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\>

The transaction, the wagmi config, the store members and the callbacks.

## Returns

`Promise`\<`void`\>

A promise that resolves when tracking has finished.
