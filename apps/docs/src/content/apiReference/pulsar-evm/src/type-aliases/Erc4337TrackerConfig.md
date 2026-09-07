[**API Reference.**](../../../README.md)

***

# Erc4337TrackerConfig\<T\>

> **Erc4337TrackerConfig**\<`T`\> = `object`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:134](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L134)

Configuration options for the low-level ERC-4337 tracker.

## Type Parameters

### T

`T` *extends* `Transaction`

## Properties

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:141](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L141)

***

### onFailure

> **onFailure**: (`result?`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:137](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L137)

#### Parameters

##### result?

[`Erc4337FetchResult`](Erc4337FetchResult.md)

#### Returns

`void`

***

### onIntervalTick?

> `optional` **onIntervalTick?**: (`result`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:138](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L138)

#### Parameters

##### result

[`Erc4337FetchResult`](Erc4337FetchResult.md)

#### Returns

`void`

***

### onSuccess

> **onSuccess**: (`result`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:136](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L136)

#### Parameters

##### result

[`Erc4337FetchResult`](Erc4337FetchResult.md)

#### Returns

`void`

***

### pollingInterval?

> `optional` **pollingInterval?**: `number`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:140](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L140)

***

### removeTxFromPool?

> `optional` **removeTxFromPool?**: (`txKey`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:139](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L139)

#### Parameters

##### txKey

`string`

#### Returns

`void`

***

### tx

> **tx**: `T` & `Pick`\<`Transaction`, `"txKey"` \| `"pending"`\>

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:135](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L135)
