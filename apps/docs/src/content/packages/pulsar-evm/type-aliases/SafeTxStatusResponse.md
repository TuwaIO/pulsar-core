# SafeTxStatusResponse

> **SafeTxStatusResponse** = `object`

Defined in: [trackers/safeTracker.ts:29](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L29)

The fields of a multisig transaction returned by the Safe Transaction Service API that the Safe tracker reads.

## Properties

### confirmations?

> `optional` **confirmations?**: `object`[] \| `null`

Defined in: [trackers/safeTracker.ts:49](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L49)

The owner confirmations collected so far.

***

### confirmationsRequired?

> `optional` **confirmationsRequired?**: `number`

Defined in: [trackers/safeTracker.ts:47](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L47)

The number of owner confirmations the Safe needs to execute the transaction (its threshold).

***

### executionDate

> **executionDate**: `string` \| `null`

Defined in: [trackers/safeTracker.ts:39](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L39)

ISO date of the execution, or `null` before execution.

***

### isExecuted

> **isExecuted**: `boolean`

Defined in: [trackers/safeTracker.ts:35](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L35)

`true` once the multisig transaction has been executed on-chain.

***

### isSuccessful

> **isSuccessful**: `boolean` \| `null`

Defined in: [trackers/safeTracker.ts:37](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L37)

Whether the execution succeeded; `null` before execution.

***

### modified

> **modified**: `string`

Defined in: [trackers/safeTracker.ts:43](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L43)

ISO date of the last change.

***

### nonce

> **nonce**: `number`

Defined in: [trackers/safeTracker.ts:45](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L45)

The Safe nonce of the transaction.

***

### safeTxHash

> **safeTxHash**: `Hex`

Defined in: [trackers/safeTracker.ts:33](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L33)

The Safe transaction hash (the `txKey` of the tracked transaction).

***

### submissionDate

> **submissionDate**: `string`

Defined in: [trackers/safeTracker.ts:41](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L41)

ISO date when the transaction was proposed to the service.

***

### transactionHash

> **transactionHash**: `Hex` \| `null`

Defined in: [trackers/safeTracker.ts:31](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L31)

The hash of the executed on-chain transaction, or `null` before execution.
