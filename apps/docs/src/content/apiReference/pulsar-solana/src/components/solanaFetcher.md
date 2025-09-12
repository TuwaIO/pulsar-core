[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaFetcher()

> **solanaFetcher**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:51](https://github.com/TuwaIO/pulsar-core/blob/494f4105ae0c6206b7fb474bf50e2b00399fd8c0/packages/pulsar-solana/src/trackers/solanaTracker.ts#L51)

A reusable fetcher for `initializePollingTracker` that queries the Solana RPC for a transaction's signature status.
This is the core polling logic that powers the tracker.

## Parameters

### \_\_namedParameters

`PollingFetcherParams`

## Returns

`Promise`\<`void`\>
