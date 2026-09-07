[**API Reference.**](../../../README.md)

***

# ~~gelatoTracker~~

> `const` **gelatoTracker**: \<`T`\>(`__namedParameters`) => `void` = `gelatoTrackerForStore`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:240](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L240)

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
It creates an authenticated Gelato RPC client and uses [gelatoFetcher](../functions/gelatoFetcher.md) to
build the fetcher, then delegates to `initializePollingTracker` with store-specific callbacks.

## Deprecated

Gelato relay is deprecated. Use TransactionTracker.ERC4337 and erc4337Tracker instead.
