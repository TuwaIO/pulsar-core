[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# safeTrackerForStore()

> **safeTrackerForStore**\<`T`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:147](https://github.com/TuwaIO/pulsar-core/blob/98e433e0b5469717bae47a7476c9ed01c1e7d3df/packages/pulsar-evm/src/trackers/safeTracker.ts#L147)

A higher-level wrapper for `safeTracker` that integrates directly with the Zustand store.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>

## Parameters

### \_\_namedParameters

`Pick`\<`ITxTrackingStore`\<[`TransactionTracker`](../enumerations/TransactionTracker.md), `T`, [`ActionTxKey`](../type-aliases/ActionTxKey.md)\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\> & `object`

## Returns

`Promise`\<`void`\>
