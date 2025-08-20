[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# safeTrackerForStore()

> **safeTrackerForStore**\<`T`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:147](https://github.com/TuwaIO/pulsar-core/blob/06efb81e25851de10cd682c9a7c240a3c9cbde6f/packages/pulsar-evm/src/trackers/safeTracker.ts#L147)

A higher-level wrapper for `safeTracker` that integrates directly with the Zustand store.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>

## Parameters

### \_\_namedParameters

`Pick`\<`ITxTrackingStore`\<[`TransactionTracker`](../enumerations/TransactionTracker.md), `T`, [`ActionTxKey`](../type-aliases/ActionTxKey.md)\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\> & `object`

## Returns

`Promise`\<`void`\>
