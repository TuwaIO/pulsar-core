[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# GelatoTaskStatusResponse

> **GelatoTaskStatusResponse** = `object`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:49](https://github.com/TuwaIO/pulsar-core/blob/37a7892af021715ac51cc1827e93ad7b2762ab6c/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L49)

Defines the shape of the response from the Gelato `getTaskStatus` API endpoint.

## Properties

### task

> **task**: `object`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:50](https://github.com/TuwaIO/pulsar-core/blob/37a7892af021715ac51cc1827e93ad7b2762ab6c/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L50)

#### blockNumber?

> `optional` **blockNumber**: `number`

#### chainId

> **chainId**: `number`

#### creationDate?

> `optional` **creationDate**: `string`

#### executionDate?

> `optional` **executionDate**: `string`

#### lastCheckMessage?

> `optional` **lastCheckMessage**: `string`

#### taskId

> **taskId**: `string`

#### taskState

> **taskState**: [`GelatoTaskState`](../enumerations/GelatoTaskState.md)

#### transactionHash?

> `optional` **transactionHash**: `Hex`
