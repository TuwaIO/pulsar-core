[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/utils/checkAndInitializeTrackerInStore.ts:21](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-solana/src/utils/checkAndInitializeTrackerInStore.ts#L21)

Initializes the correct background tracker for a given Solana transaction.
This function acts as a router, selecting the appropriate tracker based on the `tx.tracker` property.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana)\>

The transaction type, constrained to Solana transactions.

## Parameters

### params

`object` & `Pick`\<`ITxTrackingStore`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana), `T`, `string`\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\>

The parameters for initializing the tracker.

## Returns

`Promise`\<`void`\>

A promise that resolves when the tracker has been initialized.
