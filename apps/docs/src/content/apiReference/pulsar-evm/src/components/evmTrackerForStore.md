[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmTrackerForStore()

> **evmTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:126](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-evm/src/trackers/evmTracker.ts#L126)

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
