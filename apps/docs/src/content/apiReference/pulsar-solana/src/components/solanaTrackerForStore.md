[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaTrackerForStore()

> **solanaTrackerForStore**\<`T`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:96](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-solana/src/trackers/solanaTracker.ts#L96)

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
