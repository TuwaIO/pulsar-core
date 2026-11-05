# ~~GelatoBaseStatus~~

> **GelatoBaseStatus** = `object`

Defined in: [trackers/gelatoTracker.ts:50](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L50)

Fields shared by every Gelato task status response.

## Deprecated

Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.

## Properties

### ~~chainId~~

> **chainId**: `number`

Defined in: [trackers/gelatoTracker.ts:52](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L52)

The chain ID on which the task was submitted.

***

### ~~createdAt~~

> **createdAt**: `number`

Defined in: [trackers/gelatoTracker.ts:54](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L54)

Unix timestamp (in seconds) when the task was created.

***

### ~~id~~

> **id**: `string`

Defined in: [trackers/gelatoTracker.ts:56](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L56)

The unique Gelato task identifier.
