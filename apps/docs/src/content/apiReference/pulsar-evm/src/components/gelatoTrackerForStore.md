[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# gelatoTrackerForStore()

> **gelatoTrackerForStore**\<`T`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:169](https://github.com/TuwaIO/pulsar-core/blob/4e6a98991bdba757946ff4584c5a9e22ecc297f5/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L169)

A higher-level wrapper for `gelatoTracker` that integrates directly with the Zustand store.
It provides the necessary callbacks to update the transaction's state in the store.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>

The application-specific transaction union type.

## Parameters

### \_\_namedParameters

`Pick`\<`ITxTrackingStore`\<[`TransactionTracker`](../enumerations/TransactionTracker.md), `T`, [`ActionTxKey`](../type-aliases/ActionTxKey.md)\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\> & `object`

## Returns

`Promise`\<`void`\>
