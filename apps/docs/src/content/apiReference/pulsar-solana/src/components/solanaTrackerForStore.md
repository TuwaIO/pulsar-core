[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaTrackerForStore()

> **solanaTrackerForStore**\<`T`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:96](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-solana/src/trackers/solanaTracker.ts#L96)

A higher-level wrapper that integrates the Solana polling logic with the Pulsar store.
It uses the generic `solanaFetcher` and provides store-specific callbacks.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana)\>

The application-specific transaction type, constrained to Transaction.

## Parameters

### \_\_namedParameters

`Pick`\<`ITxTrackingStore`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana), `T`, `string`\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\> & `object`

## Returns

`Promise`\<`void`\>
