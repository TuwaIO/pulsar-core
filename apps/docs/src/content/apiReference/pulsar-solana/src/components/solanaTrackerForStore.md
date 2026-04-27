[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaTrackerForStore()

> **solanaTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:152](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-solana/src/trackers/solanaTracker.ts#L152)

A higher-level tracker that integrates the Solana polling logic with the Pulsar store.

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific Solana transaction type.

## Parameters

### params

`Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & `TrackerCallbacks`\<`T`\>

Parameters to connect the Solana tracker with the store.

## Returns

`Promise`\<`void`\>

Resolves when the tracker is successfully initialized.
