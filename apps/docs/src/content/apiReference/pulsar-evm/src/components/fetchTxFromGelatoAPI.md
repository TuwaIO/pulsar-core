[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# fetchTxFromGelatoAPI()

> **fetchTxFromGelatoAPI**(`params`): `Promise`\<`Response`\>

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:110](https://github.com/TuwaIO/pulsar-core/blob/ea066c8cd65e6c1227300bf48fc7dcb6a33a8ab8/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L110)

The fetcher function passed to `initializePollingTracker` to get the status of a Gelato task.

## Parameters

### params

`object` & `Pick`\<[`GelatoTrackerParams`](../type-aliases/GelatoTrackerParams.md), `"tx"` \| `"onFailed"` \| `"onIntervalTick"` \| `"onSucceed"`\>

The parameters for fetching the transaction status.

## Returns

`Promise`\<`Response`\>

The raw response from the fetch call.
