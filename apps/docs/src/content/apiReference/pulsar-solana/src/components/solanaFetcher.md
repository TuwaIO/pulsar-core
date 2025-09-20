[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaFetcher()

> **solanaFetcher**(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:57](https://github.com/TuwaIO/pulsar-core/blob/581af0fd8f6d32e377a9308802bc37dd710e7877/packages/pulsar-solana/src/trackers/solanaTracker.ts#L57)

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
