# SafeTxStatusResponse

> **SafeTxStatusResponse** = `object`

Defined in: [trackers/safeTracker.ts:28](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L28)

The fields of a multisig transaction returned by the Safe Transaction Service API that the Safe tracker reads.

## Properties

### executionDate

> **executionDate**: `string` \| `null`

Defined in: [trackers/safeTracker.ts:38](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L38)

ISO date of the execution, or `null` before execution.

***

### isExecuted

> **isExecuted**: `boolean`

Defined in: [trackers/safeTracker.ts:34](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L34)

`true` once the multisig transaction has been executed on-chain.

***

### isSuccessful

> **isSuccessful**: `boolean` \| `null`

Defined in: [trackers/safeTracker.ts:36](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L36)

Whether the execution succeeded; `null` before execution.

***

### modified

> **modified**: `string`

Defined in: [trackers/safeTracker.ts:42](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L42)

ISO date of the last change.

***

### nonce

> **nonce**: `number`

Defined in: [trackers/safeTracker.ts:44](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L44)

The Safe nonce of the transaction.

***

### safeTxHash

> **safeTxHash**: `Hex`

Defined in: [trackers/safeTracker.ts:32](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L32)

The Safe transaction hash (the `txKey` of the tracked transaction).

***

### submissionDate

> **submissionDate**: `string`

Defined in: [trackers/safeTracker.ts:40](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L40)

ISO date when the transaction was proposed to the service.

***

### transactionHash

> **transactionHash**: `Hex` \| `null`

Defined in: [trackers/safeTracker.ts:30](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L30)

The hash of the executed on-chain transaction, or `null` before execution.
