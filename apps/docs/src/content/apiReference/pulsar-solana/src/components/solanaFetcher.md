[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaFetcher()

> **solanaFetcher**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:51](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-solana/src/trackers/solanaTracker.ts#L51)

A reusable fetcher for `initializePollingTracker` that queries the Solana RPC for a transaction's signature status.
This is the core polling logic that powers the tracker.

## Parameters

### \_\_namedParameters

`PollingFetcherParams`

## Returns

`Promise`\<`void`\>
