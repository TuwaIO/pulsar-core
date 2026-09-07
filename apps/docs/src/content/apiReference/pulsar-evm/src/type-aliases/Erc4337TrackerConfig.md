[**API Reference.**](../../../README.md)

***

# Erc4337TrackerConfig\<T\>

> **Erc4337TrackerConfig**\<`T`\> = `object`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:138](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L138)

Configuration options for the low-level ERC-4337 tracker.

## Type Parameters

### T

`T` *extends* `Transaction`

## Properties

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:145](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L145)

***

### onFailure

> **onFailure**: (`result?`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:141](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L141)

#### Parameters

##### result?

[`Erc4337FetchResult`](Erc4337FetchResult.md)

#### Returns

`void`

***

### onIntervalTick?

> `optional` **onIntervalTick?**: (`result`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:142](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L142)

#### Parameters

##### result

[`Erc4337FetchResult`](Erc4337FetchResult.md)

#### Returns

`void`

***

### onSuccess

> **onSuccess**: (`result`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:140](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L140)

#### Parameters

##### result

[`Erc4337FetchResult`](Erc4337FetchResult.md)

#### Returns

`void`

***

### pollingInterval?

> `optional` **pollingInterval?**: `number`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:144](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L144)

***

### removeTxFromPool?

> `optional` **removeTxFromPool?**: (`txKey`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:143](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L143)

#### Parameters

##### txKey

`string`

#### Returns

`void`

***

### tx

> **tx**: `T` & `Pick`\<`Transaction`, `"txKey"` \| `"pending"`\>

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:139](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L139)
