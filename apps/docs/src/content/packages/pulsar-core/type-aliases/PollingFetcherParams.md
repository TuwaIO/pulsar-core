# PollingFetcherParams\<R, T\>

> **PollingFetcherParams**\<`R`, `T`\> = `object`

Defined in: [utils/initializePollingTracker.ts:15](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L15)

The argument passed to a polling fetcher on every tick. The fetcher checks the transaction once and reports the result
through the callbacks.

## Type Parameters

### R

`R`

The response type the fetcher reports.

### T

`T`

The tracked transaction type.

## Properties

### onFailure

> **onFailure**: (`response?`) => `void`

Defined in: [utils/initializePollingTracker.ts:36](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L36)

The `onFailure` callback of the tracker configuration.

#### Parameters

##### response?

`R`

The result of the check, if any.

#### Returns

`void`

***

### onIntervalTick?

> `optional` **onIntervalTick?**: (`response`) => `void`

Defined in: [utils/initializePollingTracker.ts:41](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L41)

The `onIntervalTick` callback of the tracker configuration, if any.

#### Parameters

##### response

`R`

The intermediate result.

#### Returns

`void`

***

### onReplaced?

> `optional` **onReplaced?**: (`response`) => `void`

Defined in: [utils/initializePollingTracker.ts:46](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L46)

The `onReplaced` callback of the tracker configuration, if any.

#### Parameters

##### response

`R`

The result describing the replacement.

#### Returns

`void`

***

### onSuccess

> **onSuccess**: (`response`) => `void`

Defined in: [utils/initializePollingTracker.ts:31](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L31)

The `onSuccess` callback of the tracker configuration.

#### Parameters

##### response

`R`

The result of the check.

#### Returns

`void`

***

### stopPolling

> **stopPolling**: (`options?`) => `void`

Defined in: [utils/initializePollingTracker.ts:23](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L23)

Stops polling. Unless `withoutRemoving` is `true`, it also calls `removeTxFromPool` (if configured) with the
transaction key.

#### Parameters

##### options?

Stop options.

###### withoutRemoving?

`boolean`

Keep the transaction in the pool. Defaults to `false`.

#### Returns

`void`

***

### tx

> **tx**: `T`

Defined in: [utils/initializePollingTracker.ts:17](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L17)

The tracked transaction, as passed to `initializePollingTracker`.
