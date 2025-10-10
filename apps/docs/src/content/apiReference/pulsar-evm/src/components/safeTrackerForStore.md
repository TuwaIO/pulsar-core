[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# safeTrackerForStore()

> **safeTrackerForStore**\<`T`\>(`__namedParameters`): `void`

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:123](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-evm/src/trackers/safeTracker.ts#L123)

A higher-level wrapper that integrates the Safe polling logic with the Pulsar store.
It uses the generic `safeFetcher` and provides store-specific callbacks.

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific transaction type.

## Parameters

### \_\_namedParameters

`Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & `OnSuccessCallback`\<`T`\>

## Returns

`void`
