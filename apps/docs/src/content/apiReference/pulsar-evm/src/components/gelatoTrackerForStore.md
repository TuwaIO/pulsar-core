[**API Reference.**](../../../README.md)

***

# ~~gelatoTrackerForStore()~~

> **gelatoTrackerForStore**\<`T`\>(`__namedParameters`): `void`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:162](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L162)

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific transaction type.

## Parameters

### \_\_namedParameters

`Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & `TrackerCallbacks`\<`T`\>

## Returns

`void`

## Deprecated

Gelato relay is deprecated. Use TransactionTracker.ERC4337 and erc4337TrackerForStore instead.
A higher-level wrapper that integrates the Gelato polling logic with the Pulsar store.
It creates an authenticated Gelato RPC client and uses [gelatoFetcher](gelatoFetcher.md) to
build the fetcher, then delegates to `initializePollingTracker` with store-specific callbacks.
