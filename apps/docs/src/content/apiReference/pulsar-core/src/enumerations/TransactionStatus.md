[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionStatus

Defined in: [packages/pulsar-core/src/types.ts:36](https://github.com/TuwaIO/pulsar-core/blob/98e433e0b5469717bae47a7476c9ed01c1e7d3df/packages/pulsar-core/src/types.ts#L36)

Represents the final status of a transaction.

## Enumeration Members

### Failed

> **Failed**: `"Failed"`

Defined in: [packages/pulsar-core/src/types.ts:38](https://github.com/TuwaIO/pulsar-core/blob/98e433e0b5469717bae47a7476c9ed01c1e7d3df/packages/pulsar-core/src/types.ts#L38)

The transaction failed to execute.

***

### Replaced

> **Replaced**: `"Replaced"`

Defined in: [packages/pulsar-core/src/types.ts:42](https://github.com/TuwaIO/pulsar-core/blob/98e433e0b5469717bae47a7476c9ed01c1e7d3df/packages/pulsar-core/src/types.ts#L42)

The transaction was replaced by another (e.g., speed-up).

***

### Success

> **Success**: `"Success"`

Defined in: [packages/pulsar-core/src/types.ts:40](https://github.com/TuwaIO/pulsar-core/blob/98e433e0b5469717bae47a7476c9ed01c1e7d3df/packages/pulsar-core/src/types.ts#L40)

The transaction was successfully mined and executed.
