[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# fetchTxFromGelatoAPI()

> **fetchTxFromGelatoAPI**(`params`): `Promise`\<`Response`\>

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:110](https://github.com/TuwaIO/pulsar-core/blob/98e433e0b5469717bae47a7476c9ed01c1e7d3df/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L110)

The fetcher function passed to `initializePollingTracker` to get the status of a Gelato task.

## Parameters

### params

`object` & `Pick`\<[`GelatoTrackerParams`](../type-aliases/GelatoTrackerParams.md), `"tx"` \| `"onFailed"` \| `"onIntervalTick"` \| `"onSucceed"`\>

The parameters for fetching the transaction status.

## Returns

`Promise`\<`Response`\>

The raw response from the fetch call.
