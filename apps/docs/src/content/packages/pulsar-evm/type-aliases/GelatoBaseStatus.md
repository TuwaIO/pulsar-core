# ~~GelatoBaseStatus~~

> **GelatoBaseStatus** = `object`

Defined in: [trackers/gelatoTracker.ts:49](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L49)

Fields shared by every Gelato task status response.

## Deprecated

Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.

## Properties

### ~~chainId~~

> **chainId**: `number`

Defined in: [trackers/gelatoTracker.ts:51](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L51)

The chain ID on which the task was submitted.

***

### ~~createdAt~~

> **createdAt**: `number`

Defined in: [trackers/gelatoTracker.ts:53](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L53)

Unix timestamp (in seconds) when the task was created.

***

### ~~id~~

> **id**: `string`

Defined in: [trackers/gelatoTracker.ts:55](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L55)

The unique Gelato task identifier.
