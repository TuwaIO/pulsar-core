[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/utils/checkAndInitializeTrackerInStore.ts:27](https://github.com/TuwaIO/pulsar-core/blob/e793f6c1aec3029357d46a261bbd91915587721b/packages/pulsar-solana/src/utils/checkAndInitializeTrackerInStore.ts#L27)

Initializes the correct background tracker for a given Solana transaction.
This function acts as a router, selecting the appropriate tracker based on the `tx.tracker` property.

## Type Parameters

### T

`T` *extends* `Transaction`

The transaction type.

## Parameters

### params

`object` & `TrackerCallbacks`\<`T`\> & `Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\>

The parameters for initializing the tracker.

## Returns

`Promise`\<`void`\>

A promise that resolves when the tracker has been initialized.
