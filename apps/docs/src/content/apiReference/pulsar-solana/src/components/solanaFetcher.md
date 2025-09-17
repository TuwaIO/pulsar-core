[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaFetcher()

> **solanaFetcher**(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/trackers/solanaTracker.ts:62](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-solana/src/trackers/solanaTracker.ts#L62)

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
