[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# gelatoTrackerForStore()

> **gelatoTrackerForStore**\<`T`\>(`__namedParameters`): `void`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:136](https://github.com/TuwaIO/pulsar-core/blob/4b67ec90377e30bc90519177a553a449e097fe32/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L136)

A higher-level wrapper that integrates the Gelato polling logic with the Pulsar store.
It uses the generic `gelatoFetcher` and provides store-specific callbacks.

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific transaction type.

## Parameters

### \_\_namedParameters

`Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & `OnSuccessCallback`\<`T`\>

## Returns

`void`
