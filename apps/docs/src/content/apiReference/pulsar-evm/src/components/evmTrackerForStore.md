[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmTrackerForStore()

> **evmTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:127](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-evm/src/trackers/evmTracker.ts#L127)

A higher-level wrapper for `evmTracker` that integrates directly with the Pulsar store.
It provides the necessary callbacks to update a transaction's state throughout its lifecycle.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>

The application-specific transaction type.

## Parameters

### params

`Pick`\<[`EVMTrackerParams`](../type-aliases/EVMTrackerParams.md), `"chains"`\> & `Pick`\<`ITxTrackingStore`\<[`TransactionTracker`](../enumerations/TransactionTracker.md), `T`, [`ActionTxKey`](../type-aliases/ActionTxKey.md)\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"`\> & `object`

## Returns

`Promise`\<`void`\>
