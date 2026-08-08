[**API Reference.**](../../../README.md)

***

# evmTrackerForStore()

> **evmTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:243](https://github.com/TuwaIO/pulsar-core/blob/3dc4a6cf92ff800817c9254f1839b404b495b304/packages/pulsar-evm/src/trackers/evmTracker.ts#L243)

A higher-level wrapper for `evmTracker` that integrates directly with the Pulsar store.
Updates transaction lifecycle states (pending, success, failed, replaced) in the Zustand store.

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific transaction state structure extending `Transaction`.

## Parameters

### params

`Pick`\<[`EVMTrackerParams`](../type-aliases/EVMTrackerParams.md), `"config"`\> & `Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"transactionsPool"`\> & `object` & `TrackerCallbacks`\<`T`\>

Configuration connecting `@wagmi/core`, store mutation methods, target transaction, and callbacks.

## Returns

`Promise`\<`void`\>

A promise that resolves when transaction tracking finishes and store state is committed.
