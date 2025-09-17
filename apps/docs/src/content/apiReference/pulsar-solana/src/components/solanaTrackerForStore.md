[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaTrackerForStore()

> **solanaTrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:133](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-solana/src/trackers/solanaTracker.ts#L133)

A higher-level polling tracker that integrates the Solana transaction tracking logic
with the Pulsar store's transaction management.

This function initializes and manages the lifecycle of polling for a Solana transaction's status.
It dynamically updates the transaction state in the store based on polling results.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana)\>

The application-specific type for the transaction, extending `Transaction`.

## Parameters

### params

`Pick`\<`ITxTrackingStore`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana), `T`, `string`\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\> & `object`

The parameters for the store-connected tracker.

## Returns

`Promise`\<`void`\>

A promise that resolves once the tracking process is initialized.
