[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaTrackerForStore()

> **solanaTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:159](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-solana/src/trackers/solanaTracker.ts#L159)

A higher-level tracker that integrates the Solana polling logic with the Pulsar store.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana)\>

The application-specific Solana transaction type.

## Parameters

### params

`Pick`\<`ITxTrackingStore`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana), `T`, `string`\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\> & `object`

Parameters to connect the Solana tracker with the store.

## Returns

`Promise`\<`void`\>

Resolves when the tracker is successfully initialized.
