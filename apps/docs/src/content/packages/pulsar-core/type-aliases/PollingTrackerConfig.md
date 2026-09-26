# PollingTrackerConfig\<R, T\>

> **PollingTrackerConfig**\<`R`, `T`\> = `object`

Defined in: [utils/initializePollingTracker.ts:55](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L55)

The configuration of `initializePollingTracker`.

## Type Parameters

### R

`R`

The response type the fetcher reports.

### T

`T` *extends* `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"txKey"` \| `"pending"`\>

The tracked transaction type; only `txKey` and `pending` are required.

## Properties

### fetcher

> **fetcher**: (`params`) => `Promise`\<`void`\>

Defined in: [utils/initializePollingTracker.ts:63](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L63)

Checks the transaction once per tick and reports through the callbacks it receives. It must call `stopPolling` on a
terminal result. A thrown error counts as a failed attempt.

#### Parameters

##### params

[`PollingFetcherParams`](/packages/pulsar-core/type-aliases/PollingFetcherParams.md)\<`R`, `T`\>

The transaction, `stopPolling` and the callbacks.

#### Returns

`Promise`\<`void`\>

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [utils/initializePollingTracker.ts:95](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L95)

The number of consecutive failed attempts (thrown errors) after which polling stops. Defaults to 10.

***

### onFailure

> **onFailure**: (`response?`) => `void`

Defined in: [utils/initializePollingTracker.ts:74](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L74)

Called by the fetcher when the transaction failed, and without arguments by the tracker after `maxRetries`
consecutive failed attempts.

#### Parameters

##### response?

`R`

The result reported by the fetcher, if any.

#### Returns

`void`

***

### onInitialize?

> `optional` **onInitialize?**: () => `void`

Defined in: [utils/initializePollingTracker.ts:76](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L76)

Called once, synchronously, when polling starts.

#### Returns

`void`

***

### onIntervalTick?

> `optional` **onIntervalTick?**: (`response`) => `void`

Defined in: [utils/initializePollingTracker.ts:81](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L81)

Called by the fetcher with intermediate results.

#### Parameters

##### response

`R`

The intermediate result.

#### Returns

`void`

***

### onReplaced?

> `optional` **onReplaced?**: (`response`) => `void`

Defined in: [utils/initializePollingTracker.ts:86](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L86)

Called by the fetcher when the transaction was replaced.

#### Parameters

##### response

`R`

The result describing the replacement.

#### Returns

`void`

***

### onSuccess

> **onSuccess**: (`response`) => `void`

Defined in: [utils/initializePollingTracker.ts:68](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L68)

Called by the fetcher when the transaction succeeded.

#### Parameters

##### response

`R`

The result reported by the fetcher.

#### Returns

`void`

***

### pollingInterval?

> `optional` **pollingInterval?**: `number`

Defined in: [utils/initializePollingTracker.ts:93](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L93)

The delay before each attempt, in milliseconds. Defaults to 5000.

***

### removeTxFromPool?

> `optional` **removeTxFromPool?**: (`txKey`) => `void`

Defined in: [utils/initializePollingTracker.ts:91](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L91)

Called when polling stops, unless it was stopped with `withoutRemoving: true`.

#### Parameters

##### txKey

`string`

The `txKey` of the tracked transaction.

#### Returns

`void`

***

### tx

> **tx**: `T`

Defined in: [utils/initializePollingTracker.ts:57](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L57)

The transaction to track. Polling starts only if `pending` is `true`.
