[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaFetcher()

> **solanaFetcher**(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:62](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-solana/src/trackers/solanaTracker.ts#L62)

The core polling fetcher function for Solana transactions.

This function queries the Solana RPC for updates on a transaction's status.
It processes the response and triggers appropriate callbacks (`onSuccess`, `onFailure`, etc.)
based on the transaction's state.

## Parameters

### params

`PollingFetcherParams`

The parameters for the fetcher, including the transaction object
and various callbacks for handling updates.

## Returns

`Promise`\<`void`\>

A promise that resolves once the fetcher function completes.
