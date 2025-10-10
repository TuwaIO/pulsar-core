[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# PollingTrackerConfig\<R, T\>

> **PollingTrackerConfig**\<`R`, `T`\> = `object`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:34](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-core/src/utils/initializePollingTracker.ts#L34)

Defines the configuration object for the `initializePollingTracker` function.

## Type Parameters

### R

`R`

The expected type of the successful API response.

### T

`T` *extends* [`Transaction`](Transaction.md)

The type of the transaction object.

## Properties

### fetcher()

> **fetcher**: (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:38](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-core/src/utils/initializePollingTracker.ts#L38)

The function that performs the data fetching (e.g., an API call) on each interval.

#### Parameters

##### params

`PollingFetcherParams`\<`R`, `T`\>

#### Returns

`Promise`\<`void`\>

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:54](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-core/src/utils/initializePollingTracker.ts#L54)

The number of consecutive failed fetches before stopping the tracker. Defaults to 10.

***

### onFailure()

> **onFailure**: (`response?`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:42](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-core/src/utils/initializePollingTracker.ts#L42)

Callback to be invoked when the transaction fails.

#### Parameters

##### response?

`R`

#### Returns

`void`

***

### onInitialize()?

> `optional` **onInitialize**: () => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:44](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-core/src/utils/initializePollingTracker.ts#L44)

Optional callback executed once when the tracker is initialized.

#### Returns

`void`

***

### onIntervalTick()?

> `optional` **onIntervalTick**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:46](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-core/src/utils/initializePollingTracker.ts#L46)

Optional callback for each successful poll.

#### Parameters

##### response

`R`

#### Returns

`void`

***

### onReplaced()?

> `optional` **onReplaced**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:48](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-core/src/utils/initializePollingTracker.ts#L48)

Optional callback for when a transaction is replaced.

#### Parameters

##### response

`R`

#### Returns

`void`

***

### onSuccess()

> **onSuccess**: (`response`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:40](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-core/src/utils/initializePollingTracker.ts#L40)

Callback to be invoked when the transaction successfully completes.

#### Parameters

##### response

`R`

#### Returns

`void`

***

### pollingInterval?

> `optional` **pollingInterval**: `number`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:52](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-core/src/utils/initializePollingTracker.ts#L52)

The interval (in milliseconds) between polling attempts. Defaults to 5000ms.

***

### removeTxFromPool()?

> `optional` **removeTxFromPool**: (`txKey`) => `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:50](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-core/src/utils/initializePollingTracker.ts#L50)

Optional function to remove the transaction from the main pool, typically after polling stops.

#### Parameters

##### txKey

`string`

#### Returns

`void`

***

### tx

> **tx**: `T` & `Pick`\<[`Transaction`](Transaction.md), `"txKey"` \| `"pending"`\>

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:36](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-core/src/utils/initializePollingTracker.ts#L36)

The transaction object to be tracked. It must include `txKey` and `pending` status.
