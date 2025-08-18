[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# safeTrackerForStore()

> **safeTrackerForStore**\<`T`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:147](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-evm/src/trackers/safeTracker.ts#L147)

A higher-level wrapper for `safeTracker` that integrates directly with the Zustand store.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>

## Parameters

### \_\_namedParameters

`Pick`\<`ITxTrackingStore`\<[`TransactionTracker`](../enumerations/TransactionTracker.md), `T`, [`ActionTxKey`](../type-aliases/ActionTxKey.md)\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\> & `object`

## Returns

`Promise`\<`void`\>
