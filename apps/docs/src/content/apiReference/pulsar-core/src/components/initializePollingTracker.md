[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# initializePollingTracker()

> **initializePollingTracker**\<`R`, `T`, `TR`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:61](https://github.com/TuwaIO/pulsar-core/blob/3276bf16709f6ec29953e98e8eed75f9c97b41d2/packages/pulsar-core/src/utils/initializePollingTracker.ts#L61)

Initializes a generic polling tracker that repeatedly calls a fetcher function
to monitor the status of a transaction or any asynchronous task.

## Type Parameters

### R

`R`

The expected type of the successful API response.

### T

`T`

The type of the transaction object.

### TR

`TR`

The type of the tracker identifier.

## Parameters

### params

[`InitializePollingTracker`](../type-aliases/InitializePollingTracker.md)\<`R`, `T`, `TR`\>

The configuration object for the tracker.

## Returns

`Promise`\<`void`\>

A promise that resolves when the tracker is set up (note: polling happens asynchronously).
