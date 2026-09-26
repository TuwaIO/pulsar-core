# ~~GelatoStatusCode~~

Defined in: [trackers/gelatoTracker.ts:31](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L31)

Numeric status codes returned by the Gelato `relayer_getStatus` RPC method.

## Deprecated

Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.

## See

[Gelato documentation](https://docs.gelato.cloud/)

## Enumeration Members

### ~~Pending~~

> **Pending**: `100`

Defined in: [trackers/gelatoTracker.ts:33](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L33)

The task has been received and is awaiting execution.

***

### ~~Rejected~~

> **Rejected**: `400`

Defined in: [trackers/gelatoTracker.ts:39](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L39)

The task was rejected by the relayer before execution (e.g., validation failure).

***

### ~~Reverted~~

> **Reverted**: `500`

Defined in: [trackers/gelatoTracker.ts:41](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L41)

The task was submitted but the transaction reverted on-chain.

***

### ~~Submitted~~

> **Submitted**: `110`

Defined in: [trackers/gelatoTracker.ts:35](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L35)

The task has been submitted to the mempool and has a transaction hash.

***

### ~~Success~~

> **Success**: `200`

Defined in: [trackers/gelatoTracker.ts:37](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L37)

The task was successfully executed and mined.
