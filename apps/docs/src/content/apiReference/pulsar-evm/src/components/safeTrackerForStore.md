[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# safeTrackerForStore()

> **safeTrackerForStore**\<`T`\>(`__namedParameters`): `void`

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:123](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-evm/src/trackers/safeTracker.ts#L123)

A higher-level wrapper that integrates the Safe polling logic with the Pulsar store.
It uses the generic `safeFetcher` and provides store-specific callbacks.

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific transaction type.

## Parameters

### \_\_namedParameters

`Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & `TrackerCallbacks`\<`T`\>

## Returns

`void`
