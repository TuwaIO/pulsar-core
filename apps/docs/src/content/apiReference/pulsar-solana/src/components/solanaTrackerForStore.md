[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaTrackerForStore()

> **solanaTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:153](https://github.com/TuwaIO/pulsar-core/blob/227594b111c3b7431fc1b2bfe3380cc9ee0fa156/packages/pulsar-solana/src/trackers/solanaTracker.ts#L153)

A higher-level tracker that integrates the Solana polling logic with the Pulsar store.

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific Solana transaction type.

## Parameters

### params

`Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object`

Parameters to connect the Solana tracker with the store.

## Returns

`Promise`\<`void`\>

Resolves when the tracker is successfully initialized.
