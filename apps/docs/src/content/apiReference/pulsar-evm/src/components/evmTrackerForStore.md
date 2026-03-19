[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmTrackerForStore()

> **evmTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:123](https://github.com/TuwaIO/pulsar-core/blob/2f1f6a4f06a19b6a90ce02fab5bff03e7ac74e24/packages/pulsar-evm/src/trackers/evmTracker.ts#L123)

A higher-level wrapper for `evmTracker` that integrates directly with the Pulsar store.
It provides the necessary callbacks to update a transaction's state throughout its lifecycle.

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific transaction type.

## Parameters

### params

`Pick`\<[`EVMTrackerParams`](../type-aliases/EVMTrackerParams.md), `"config"`\> & `Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"transactionsPool"`\> & `object` & `TrackerCallbacks`\<`T`\>

## Returns

`Promise`\<`void`\>
