[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionStatus

Defined in: [packages/pulsar-core/src/types.ts:36](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L36)

Represents the final status of a transaction.

## Enumeration Members

### Failed

> **Failed**: `"Failed"`

Defined in: [packages/pulsar-core/src/types.ts:38](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L38)

The transaction failed to execute.

***

### Replaced

> **Replaced**: `"Replaced"`

Defined in: [packages/pulsar-core/src/types.ts:42](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L42)

The transaction was replaced by another (e.g., speed-up).

***

### Success

> **Success**: `"Success"`

Defined in: [packages/pulsar-core/src/types.ts:40](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L40)

The transaction was successfully mined and executed.
