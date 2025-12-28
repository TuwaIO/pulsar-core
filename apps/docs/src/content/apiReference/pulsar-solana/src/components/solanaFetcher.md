[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaFetcher()

> **solanaFetcher**(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:56](https://github.com/TuwaIO/pulsar-core/blob/390277bbf609352dd648b8af1de972edde5d1ea5/packages/pulsar-solana/src/trackers/solanaTracker.ts#L56)

Fetches and tracks Solana transactions using the `getSignatureStatuses` RPC method.
Transaction details (`getTransaction`) are only fetched once, if not already present in the transaction object.

## Parameters

### params

`PollingFetcherParams`

The fetcher parameters, automatically provided by the tracker.

## Returns

`Promise`\<`void`\>

Resolves when the fetcher completes execution for the current polling cycle.

## Throws

Will throw an error if the transaction adapter is not set to Solana.
