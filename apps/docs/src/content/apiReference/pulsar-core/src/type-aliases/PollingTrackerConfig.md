[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# PollingTrackerConfig\<R, T, TR\>

> **PollingTrackerConfig**\<`R`, `T`, `TR`\> = `object`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:35](https://github.com/TuwaIO/pulsar-core/blob/ec5ee833ca939943dee97a8e5938dc68d269fd66/packages/pulsar-core/src/utils/initializePollingTracker.ts#L35)

Defines the configuration object for the `initializePollingTracker` function.

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

## Properties

### fetcher()

> **fetcher**: (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:39](https://github.com/TuwaIO/pulsar-core/blob/ec5ee833ca939943dee97a8e5938dc68d269fd66/packages/pulsar-core/src/utils/initializePollingTracker.ts#L39)

The function that performs the data fetching (e.g., an API call) on each interval.

#### Parameters

##### params

`PollingFetcherParams`\<`R`, `T`\>

#### Returns

`Promise`\<`void`\>

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:55](https://github.com/TuwaIO/pulsar-core/blob/ec5ee833ca939943dee97a8e5938dc68d269fd66/packages/pulsar-core/src/utils/initializePollingTracker.ts#L55)

The number of consecutive failed fetches before stopping the tracker. Defaults to 10.

***

### onFailure()

> **onFailure**: (`response?`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:43](https://github.com/TuwaIO/pulsar-core/blob/ec5ee833ca939943dee97a8e5938dc68d269fd66/packages/pulsar-core/src/utils/initializePollingTracker.ts#L43)

Callback to be invoked when the transaction fails.

#### Parameters

##### response?

`R`

#### Returns

`void`

***

### onInitialize()?

> `optional` **onInitialize**: () => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:45](https://github.com/TuwaIO/pulsar-core/blob/ec5ee833ca939943dee97a8e5938dc68d269fd66/packages/pulsar-core/src/utils/initializePollingTracker.ts#L45)

Optional callback executed once when the tracker is initialized.

#### Returns

`void`

***

### onIntervalTick()?

> `optional` **onIntervalTick**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:47](https://github.com/TuwaIO/pulsar-core/blob/ec5ee833ca939943dee97a8e5938dc68d269fd66/packages/pulsar-core/src/utils/initializePollingTracker.ts#L47)

Optional callback for each successful poll.

#### Parameters

##### response

`R`

#### Returns

`void`

***

### onReplaced()?

> `optional` **onReplaced**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:49](https://github.com/TuwaIO/pulsar-core/blob/ec5ee833ca939943dee97a8e5938dc68d269fd66/packages/pulsar-core/src/utils/initializePollingTracker.ts#L49)

Optional callback for when a transaction is replaced.

#### Parameters

##### response

`R`

#### Returns

`void`

***

### onSuccess()

> **onSuccess**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:41](https://github.com/TuwaIO/pulsar-core/blob/ec5ee833ca939943dee97a8e5938dc68d269fd66/packages/pulsar-core/src/utils/initializePollingTracker.ts#L41)

Callback to be invoked when the transaction successfully completes.

#### Parameters

##### response

`R`

#### Returns

`void`

***

### pollingInterval?

> `optional` **pollingInterval**: `number`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:53](https://github.com/TuwaIO/pulsar-core/blob/ec5ee833ca939943dee97a8e5938dc68d269fd66/packages/pulsar-core/src/utils/initializePollingTracker.ts#L53)

The interval (in milliseconds) between polling attempts. Defaults to 5000ms.

***

### removeTxFromPool()?

> `optional` **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:51](https://github.com/TuwaIO/pulsar-core/blob/ec5ee833ca939943dee97a8e5938dc68d269fd66/packages/pulsar-core/src/utils/initializePollingTracker.ts#L51)

Optional function to remove the transaction from the main pool, typically after polling stops.

#### Parameters

##### txKey

`string`

#### Returns

`void`

***

### tx

> **tx**: `T` & `Pick`\<[`Transaction`](Transaction.md)\<`TR`\>, `"txKey"` \| `"pending"`\>

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:37](https://github.com/TuwaIO/pulsar-core/blob/ec5ee833ca939943dee97a8e5938dc68d269fd66/packages/pulsar-core/src/utils/initializePollingTracker.ts#L37)

The transaction object to be tracked. It must include `txKey` and `pending` status.
