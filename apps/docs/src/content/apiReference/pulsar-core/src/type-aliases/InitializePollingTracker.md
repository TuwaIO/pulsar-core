[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitializePollingTracker\<R, T, TR\>

> **InitializePollingTracker**\<`R`, `T`, `TR`\> = `object`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:14](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-core/src/utils/initializePollingTracker.ts#L14)

Defines the configuration object for the `initializePollingTracker` function.

## Type Parameters

### R

`R`

The expected type of the successful API response from the fetcher.

### T

`T`

The type of the transaction object being tracked.

### TR

`TR`

The type of the tracker identifier used in the `Transaction` type.

## Properties

### fetcher()

> **fetcher**: (`params`) => `Promise`\<`Response`\>

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:18](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-core/src/utils/initializePollingTracker.ts#L18)

The function that performs the actual data fetching (e.g., an API call).

#### Parameters

##### params

###### clearWatch

(`withoutRemoving?`) => `void`

A callback to stop the polling mechanism, typically called on success or terminal failure.

###### onFailed

(`response`) => `void`

Callback to be invoked when the fetcher determines the transaction has failed.

###### onIntervalTick?

(`response`) => `void`

Optional callback for each successful poll, useful for updating UI with intermediate states.

###### onReplaced?

(`response`) => `void`

Optional callback for when a transaction is replaced by another.

###### onSucceed

(`response`) => `void`

Callback to be invoked when the fetcher determines the transaction has succeeded.

###### tx

`T`

The transaction object being tracked.

#### Returns

`Promise`\<`Response`\>

***

### onFailed()

> **onFailed**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:38](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-core/src/utils/initializePollingTracker.ts#L38)

Callback to be invoked when the transaction has failed.

#### Parameters

##### response

`R`

#### Returns

`void`

***

### onInitialize()?

> `optional` **onInitialize**: () => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:34](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-core/src/utils/initializePollingTracker.ts#L34)

Optional callback executed once when the tracker is initialized.

#### Returns

`void`

***

### onIntervalTick()?

> `optional` **onIntervalTick**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:40](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-core/src/utils/initializePollingTracker.ts#L40)

Optional callback for each successful poll.

#### Parameters

##### response

`R`

#### Returns

`void`

***

### onReplaced()?

> `optional` **onReplaced**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:42](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-core/src/utils/initializePollingTracker.ts#L42)

Optional callback for when a transaction is replaced.

#### Parameters

##### response

`R`

#### Returns

`void`

***

### onSucceed()

> **onSucceed**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:36](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-core/src/utils/initializePollingTracker.ts#L36)

Callback to be invoked when the transaction has succeeded.

#### Parameters

##### response

`R`

#### Returns

`void`

***

### pollingInterval?

> `optional` **pollingInterval**: `number`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:46](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-core/src/utils/initializePollingTracker.ts#L46)

The interval (in milliseconds) between polling attempts. Defaults to 5000ms.

***

### removeTxFromPool()?

> `optional` **removeTxFromPool**: (`taskId`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:44](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-core/src/utils/initializePollingTracker.ts#L44)

Optional function to remove the transaction from the main pool, typically after polling stops.

#### Parameters

##### taskId

`string`

#### Returns

`void`

***

### retryCount?

> `optional` **retryCount**: `number`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:48](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-core/src/utils/initializePollingTracker.ts#L48)

The number of consecutive failed fetches before stopping the tracker. Defaults to 10.

***

### tx

> **tx**: `T` & `Pick`\<[`Transaction`](Transaction.md)\<`TR`\>, `"txKey"`\> & `object`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:16](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-core/src/utils/initializePollingTracker.ts#L16)

The transaction object to be tracked. It must include `txKey` and an optional `pending` status.

#### Type declaration

##### pending?

> `optional` **pending**: `boolean`
