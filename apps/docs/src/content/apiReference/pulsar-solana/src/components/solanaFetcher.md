[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaFetcher()

> **solanaFetcher**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:51](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-solana/src/trackers/solanaTracker.ts#L51)

A reusable fetcher for `initializePollingTracker` that queries the Solana RPC for a transaction's signature status.
This is the core polling logic that powers the tracker.

## Parameters

### \_\_namedParameters

`PollingFetcherParams`

## Returns

`Promise`\<`void`\>
