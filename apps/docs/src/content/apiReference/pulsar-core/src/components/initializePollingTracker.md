[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# initializePollingTracker()

> **initializePollingTracker**\<`R`, `T`\>(`config`): `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:71](https://github.com/TuwaIO/pulsar-core/blob/60bbca9feab340b4bac58012b93caa368d33efe5/packages/pulsar-core/src/utils/initializePollingTracker.ts#L71)

Initializes a generic polling tracker that repeatedly calls a fetcher function
to monitor the status of an asynchronous task.

This function handles the lifecycle of polling, including starting, stopping,
and automatic termination after a certain number of failed attempts.

## Type Parameters

### R

`R`

The expected type of the API response.

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

The type of the transaction object.

## Parameters

### config

[`PollingTrackerConfig`](../type-aliases/PollingTrackerConfig.md)\<`R`, `T`\>

The configuration for the tracker.

## Returns

`void`
