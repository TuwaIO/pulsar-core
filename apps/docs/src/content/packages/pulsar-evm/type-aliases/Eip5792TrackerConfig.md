# Eip5792TrackerConfig\<T\>

> **Eip5792TrackerConfig**\<`T`\> = `object`

Defined in: [trackers/eip5792Tracker.ts:99](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L99)

The configuration of [eip5792Tracker](/packages/pulsar-evm/functions/eip5792Tracker.md).

## Type Parameters

### T

`T` *extends* [`Eip5792FetcherTx`](/packages/pulsar-evm/type-aliases/Eip5792FetcherTx.md) & `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"pending"`\>

The tracked transaction type.

## Properties

### config

> **config**: `Config`

Defined in: [trackers/eip5792Tracker.ts:103](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L103)

The wagmi config with the wallet that sent the batch.

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [trackers/eip5792Tracker.ts:122](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L122)

The number of consecutive failed attempts after which polling stops. Defaults to 60.

***

### onFailure

> **onFailure**: (`result?`) => `void`

Defined in: [trackers/eip5792Tracker.ts:113](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L113)

Called when the batch failed, and without arguments after `maxRetries` consecutive failed attempts.

#### Parameters

##### result?

[`Eip5792FetchResult`](/packages/pulsar-evm/type-aliases/Eip5792FetchResult.md)

The result with the failure `reason`, if any.

#### Returns

`void`

***

### onIntervalTick?

> `optional` **onIntervalTick?**: (`result`) => `void`

Defined in: [trackers/eip5792Tracker.ts:118](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L118)

Called on every tick while the batch is pending.

#### Parameters

##### result

[`Eip5792FetchResult`](/packages/pulsar-evm/type-aliases/Eip5792FetchResult.md)

The pending result.

#### Returns

`void`

***

### onSuccess

> **onSuccess**: (`result`) => `void`

Defined in: [trackers/eip5792Tracker.ts:108](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L108)

Called when the batch was executed.

#### Parameters

##### result

[`Eip5792FetchResult`](/packages/pulsar-evm/type-aliases/Eip5792FetchResult.md)

The result; `hash` is the transaction that executed it.

#### Returns

`void`

***

### pollingInterval?

> `optional` **pollingInterval?**: `number`

Defined in: [trackers/eip5792Tracker.ts:120](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L120)

The delay before each attempt, in milliseconds. Defaults to 2000.

***

### tx

> **tx**: `T`

Defined in: [trackers/eip5792Tracker.ts:101](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L101)

The batch to track; `txKey` is the batch ID. Polling starts only if `pending` is `true`.
