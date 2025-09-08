[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmTrackerForStore()

> **evmTrackerForStore**\<`T`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:143](https://github.com/TuwaIO/pulsar-core/blob/5f80225d0a8565ec635854d23c046124061ca952/packages/pulsar-evm/src/trackers/evmTracker.ts#L143)

A higher-level wrapper for `evmTracker` that integrates directly with the Zustand store.
It provides the necessary callbacks to update the transaction's state in the store.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>

The application-specific transaction union type.

## Parameters

### \_\_namedParameters

`Pick`\<[`EVMTrackerParams`](../type-aliases/EVMTrackerParams.md), `"chains"`\> & `Pick`\<`ITxTrackingStore`\<[`TransactionTracker`](../enumerations/TransactionTracker.md), `T`, [`ActionTxKey`](../type-aliases/ActionTxKey.md)\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"`\> & `object`

## Returns

`Promise`\<`void`\>
