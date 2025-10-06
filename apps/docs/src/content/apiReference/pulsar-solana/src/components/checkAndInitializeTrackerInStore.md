[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/utils/checkAndInitializeTrackerInStore.ts:26](https://github.com/TuwaIO/pulsar-core/blob/bdceb94ce44190f4d3014c2e4cf435b68c70b5b1/packages/pulsar-solana/src/utils/checkAndInitializeTrackerInStore.ts#L26)

Initializes the correct background tracker for a given Solana transaction.
This function acts as a router, selecting the appropriate tracker based on the `tx.tracker` property.

## Type Parameters

### T

`T` *extends* `Transaction`

The transaction type.

## Parameters

### params

`object` & `OnSuccessCallback`\<`T`\> & `Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\>

The parameters for initializing the tracker.

## Returns

`Promise`\<`void`\>

A promise that resolves when the tracker has been initialized.
