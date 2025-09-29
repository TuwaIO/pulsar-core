[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaTrackerForStore()

> **solanaTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:152](https://github.com/TuwaIO/pulsar-core/blob/e926d5f5ee625996a23d6a30b8f5364a3dbf86df/packages/pulsar-solana/src/trackers/solanaTracker.ts#L152)

A higher-level tracker that integrates the Solana polling logic with the Pulsar store.

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific Solana transaction type.

## Parameters

### params

`Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & `OnSuccessCallback`\<`T`\>

Parameters to connect the Solana tracker with the store.

## Returns

`Promise`\<`void`\>

Resolves when the tracker is successfully initialized.
