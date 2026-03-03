[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# GelatoStatusCode

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:32](https://github.com/TuwaIO/pulsar-core/blob/4635500b0fb82b05bdae30ba5551c3bed49eb344/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L32)

Numeric status codes returned by the Gelato `relayer_getStatus` RPC method.

## See

https://docs.gelato.cloud/

## Enumeration Members

### Pending

> **Pending**: `100`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:34](https://github.com/TuwaIO/pulsar-core/blob/4635500b0fb82b05bdae30ba5551c3bed49eb344/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L34)

The task has been received and is awaiting execution.

***

### Rejected

> **Rejected**: `400`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:40](https://github.com/TuwaIO/pulsar-core/blob/4635500b0fb82b05bdae30ba5551c3bed49eb344/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L40)

The task was rejected by the relayer before execution (e.g., validation failure).

***

### Reverted

> **Reverted**: `500`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:42](https://github.com/TuwaIO/pulsar-core/blob/4635500b0fb82b05bdae30ba5551c3bed49eb344/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L42)

The task was submitted but the transaction reverted on-chain.

***

### Submitted

> **Submitted**: `110`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:36](https://github.com/TuwaIO/pulsar-core/blob/4635500b0fb82b05bdae30ba5551c3bed49eb344/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L36)

The task has been submitted to the mempool and has a transaction hash.

***

### Success

> **Success**: `200`

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:38](https://github.com/TuwaIO/pulsar-core/blob/4635500b0fb82b05bdae30ba5551c3bed49eb344/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L38)

The task was successfully executed and mined.
