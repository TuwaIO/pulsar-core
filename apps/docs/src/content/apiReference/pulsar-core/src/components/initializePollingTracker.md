[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# initializePollingTracker()

> **initializePollingTracker**\<`R`, `T`, `TR`\>(`config`): `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:73](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-core/src/utils/initializePollingTracker.ts#L73)

Initializes a generic polling tracker that repeatedly calls a fetcher function
to monitor the status of an asynchronous task.

This function handles the lifecycle of polling, including starting, stopping,
and automatic termination after a certain number of failed attempts.

## Type Parameters

### R

`R`

The expected type of the API response.

### T

`T`

The type of the transaction object.

### TR

`TR`

The type of the tracker identifier.

## Parameters

### config

[`PollingTrackerConfig`](../type-aliases/PollingTrackerConfig.md)\<`R`, `T`, `TR`\>

The configuration for the tracker.

## Returns

`void`
