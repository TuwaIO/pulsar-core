[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# fetchTxFromSafeAPI()

> **fetchTxFromSafeAPI**(`__namedParameters`): `Promise`\<`Response`\>

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:69](https://github.com/TuwaIO/pulsar-core/blob/720ae68e888aeb5b19c59753a144a246fe05cc4c/packages/pulsar-evm/src/trackers/safeTracker.ts#L69)

The fetcher function passed to `initializePollingTracker` to get the status of a Safe transaction.

## Parameters

### \_\_namedParameters

`object` & `Pick`\<[`SafeTrackerParams`](../type-aliases/SafeTrackerParams.md), `"tx"` \| `"onFailed"` \| `"onIntervalTick"` \| `"onSucceed"` \| `"onReplaced"`\>

## Returns

`Promise`\<`Response`\>

The raw response from the fetch call.
