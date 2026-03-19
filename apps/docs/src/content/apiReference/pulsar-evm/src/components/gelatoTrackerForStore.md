[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# gelatoTrackerForStore()

> **gelatoTrackerForStore**\<`T`\>(`__namedParameters`): `void`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:160](https://github.com/TuwaIO/pulsar-core/blob/820bd4fc4144158cb642b3967328e54bb81e2fb3/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L160)

A higher-level wrapper that integrates the Gelato polling logic with the Pulsar store.
It creates an authenticated Gelato RPC client and uses [gelatoFetcher](gelatoFetcher.md) to
build the fetcher, then delegates to `initializePollingTracker` with store-specific callbacks.

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific transaction type.

## Parameters

### \_\_namedParameters

`Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & `TrackerCallbacks`\<`T`\>

## Returns

`void`
