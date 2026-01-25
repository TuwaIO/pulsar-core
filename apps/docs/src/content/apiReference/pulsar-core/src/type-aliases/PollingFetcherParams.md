[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# PollingFetcherParams\<R, T\>

> **PollingFetcherParams**\<`R`, `T`\> = `object`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:14](https://github.com/TuwaIO/pulsar-core/blob/2945b2501ed48311a673ca82e77467e5176a417d/packages/pulsar-core/src/utils/initializePollingTracker.ts#L14)

Defines the parameters for the fetcher function used within the polling tracker.
The fetcher is the core logic that performs the actual API call.

## Type Parameters

### R

`R`

The expected type of the successful API response.

### T

`T`

The type of the transaction object being tracked.

## Properties

### onFailure()

> **onFailure**: (`response?`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:22](https://github.com/TuwaIO/pulsar-core/blob/2945b2501ed48311a673ca82e77467e5176a417d/packages/pulsar-core/src/utils/initializePollingTracker.ts#L22)

Callback to be invoked when the fetcher determines the transaction has failed.

#### Parameters

##### response?

`R`

#### Returns

`void`

***

### onIntervalTick()?

> `optional` **onIntervalTick**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:24](https://github.com/TuwaIO/pulsar-core/blob/2945b2501ed48311a673ca82e77467e5176a417d/packages/pulsar-core/src/utils/initializePollingTracker.ts#L24)

Optional callback for each successful poll, useful for updating UI with intermediate states.

#### Parameters

##### response

`R`

#### Returns

`void`

***

### onReplaced()?

> `optional` **onReplaced**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:26](https://github.com/TuwaIO/pulsar-core/blob/2945b2501ed48311a673ca82e77467e5176a417d/packages/pulsar-core/src/utils/initializePollingTracker.ts#L26)

Optional callback for when a transaction is replaced (e.g., speed-up).

#### Parameters

##### response

`R`

#### Returns

`void`

***

### onSuccess()

> **onSuccess**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:20](https://github.com/TuwaIO/pulsar-core/blob/2945b2501ed48311a673ca82e77467e5176a417d/packages/pulsar-core/src/utils/initializePollingTracker.ts#L20)

Callback to be invoked when the fetcher determines the transaction has succeeded.

#### Parameters

##### response

`R`

#### Returns

`void`

***

### stopPolling()

> **stopPolling**: (`options?`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:18](https://github.com/TuwaIO/pulsar-core/blob/2945b2501ed48311a673ca82e77467e5176a417d/packages/pulsar-core/src/utils/initializePollingTracker.ts#L18)

A callback to stop the polling mechanism, typically called on success or terminal failure.

#### Parameters

##### options?

###### withoutRemoving?

`boolean`

#### Returns

`void`

***

### tx

> **tx**: `T`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:16](https://github.com/TuwaIO/pulsar-core/blob/2945b2501ed48311a673ca82e77467e5176a417d/packages/pulsar-core/src/utils/initializePollingTracker.ts#L16)

The transaction object being tracked.
