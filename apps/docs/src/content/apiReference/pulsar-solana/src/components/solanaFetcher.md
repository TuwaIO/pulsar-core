[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaFetcher()

> **solanaFetcher**(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:56](https://github.com/TuwaIO/pulsar-core/blob/3776e8cceb12ffbe5dc480169b68929e67178ab8/packages/pulsar-solana/src/trackers/solanaTracker.ts#L56)

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
