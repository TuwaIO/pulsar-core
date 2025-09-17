[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# GelatoTaskStatusResponse

> **GelatoTaskStatusResponse** = `object`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:55](https://github.com/TuwaIO/pulsar-core/blob/e4e6c80b06717a36e79850d69c03d964005053f1/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L55)

Defines the shape of the response from the Gelato `getTaskStatus` API endpoint.

## Properties

### task

> **task**: `object`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:56](https://github.com/TuwaIO/pulsar-core/blob/e4e6c80b06717a36e79850d69c03d964005053f1/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L56)

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
