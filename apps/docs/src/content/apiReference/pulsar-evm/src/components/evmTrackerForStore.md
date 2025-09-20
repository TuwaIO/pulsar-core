[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmTrackerForStore()

> **evmTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:126](https://github.com/TuwaIO/pulsar-core/blob/5415e11372c5ba1e590020a446666e4f0bb4d82d/packages/pulsar-evm/src/trackers/evmTracker.ts#L126)

A higher-level wrapper for `evmTracker` that integrates directly with the Pulsar store.
It provides the necessary callbacks to update a transaction's state throughout its lifecycle.

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific transaction type.

## Parameters

### params

`Pick`\<[`EVMTrackerParams`](../type-aliases/EVMTrackerParams.md), `"chains"`\> & `Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"transactionsPool"`\> & `object` & `OnSuccessCallback`\<`T`\>

## Returns

`Promise`\<`void`\>
