# Erc4337TrackerConfig\<T\>

> **Erc4337TrackerConfig**\<`T`\> = `object`

Defined in: [trackers/erc4337Tracker.ts:157](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L157)

The configuration of [erc4337Tracker](/packages/pulsar-evm/functions/erc4337Tracker.md).

## Type Parameters

### T

`T` *extends* [`Erc4337FetcherTx`](/packages/pulsar-evm/type-aliases/Erc4337FetcherTx.md) & `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"pending"`\>

The tracked transaction type.

## Properties

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [trackers/erc4337Tracker.ts:184](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L184)

The number of consecutive failed attempts after which polling stops. Defaults to 60.

***

### onFailure

> **onFailure**: (`result?`) => `void`

Defined in: [trackers/erc4337Tracker.ts:170](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L170)

Called when the UserOperation reverted or the chain ID is invalid, and without arguments after `maxRetries`
consecutive failed attempts.

#### Parameters

##### result?

[`Erc4337FetchResult`](/packages/pulsar-evm/type-aliases/Erc4337FetchResult.md)

The result with the failure `reason`, if any.

#### Returns

`void`

***

### onIntervalTick?

> `optional` **onIntervalTick?**: (`result`) => `void`

Defined in: [trackers/erc4337Tracker.ts:175](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L175)

Called on every tick while the UserOperation is not bundled.

#### Parameters

##### result

[`Erc4337FetchResult`](/packages/pulsar-evm/type-aliases/Erc4337FetchResult.md)

The pending result.

#### Returns

`void`

***

### onSuccess

> **onSuccess**: (`result`) => `void`

Defined in: [trackers/erc4337Tracker.ts:164](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L164)

Called when the UserOperation succeeded.

#### Parameters

##### result

[`Erc4337FetchResult`](/packages/pulsar-evm/type-aliases/Erc4337FetchResult.md)

The result; `hash` is the bundle transaction hash.

#### Returns

`void`

***

### pollingInterval?

> `optional` **pollingInterval?**: `number`

Defined in: [trackers/erc4337Tracker.ts:182](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L182)

The delay before each attempt, in milliseconds. Defaults to 2000.

***

### removeTxFromPool?

> `optional` **removeTxFromPool?**: (`txKey`) => `void`

Defined in: [trackers/erc4337Tracker.ts:180](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L180)

Called when polling stops after `maxRetries` consecutive failed attempts.

#### Parameters

##### txKey

`string`

The `userOpHash`.

#### Returns

`void`

***

### tx

> **tx**: `T`

Defined in: [trackers/erc4337Tracker.ts:159](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L159)

The UserOperation to track (see [Erc4337FetcherTx](/packages/pulsar-evm/type-aliases/Erc4337FetcherTx.md)); polling starts only if `pending` is `true`.
