[**API Reference.**](../../../README.md)

***

# Erc4337TrackerConfig\<T\>

> **Erc4337TrackerConfig**\<`T`\> = `object`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:99](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L99)

Configuration options for the low-level ERC-4337 tracker.

## Type Parameters

### T

`T` *extends* `Transaction`

## Properties

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:106](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L106)

***

### onFailure

> **onFailure**: (`result?`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:102](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L102)

#### Parameters

##### result?

[`Erc4337FetchResult`](Erc4337FetchResult.md)

#### Returns

`void`

***

### onIntervalTick?

> `optional` **onIntervalTick?**: (`result`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:103](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L103)

#### Parameters

##### result

[`Erc4337FetchResult`](Erc4337FetchResult.md)

#### Returns

`void`

***

### onSuccess

> **onSuccess**: (`result`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:101](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L101)

#### Parameters

##### result

[`Erc4337FetchResult`](Erc4337FetchResult.md)

#### Returns

`void`

***

### pollingInterval?

> `optional` **pollingInterval?**: `number`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:105](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L105)

***

### removeTxFromPool?

> `optional` **removeTxFromPool?**: (`txKey`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:104](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L104)

#### Parameters

##### txKey

`string`

#### Returns

`void`

***

### tx

> **tx**: `T` & `Pick`\<`Transaction`, `"txKey"` \| `"pending"`\>

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:100](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L100)
