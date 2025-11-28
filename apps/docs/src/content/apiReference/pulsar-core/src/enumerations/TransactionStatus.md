[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionStatus

Defined in: [packages/pulsar-core/src/types.ts:32](https://github.com/TuwaIO/pulsar-core/blob/60c0779bdb5f397a3581ac6699d8168f97eb6b11/packages/pulsar-core/src/types.ts#L32)

Represents the terminal status of a transaction after it has been processed.

## Enumeration Members

### Failed

> **Failed**: `"Failed"`

Defined in: [packages/pulsar-core/src/types.ts:34](https://github.com/TuwaIO/pulsar-core/blob/60c0779bdb5f397a3581ac6699d8168f97eb6b11/packages/pulsar-core/src/types.ts#L34)

The transaction failed to execute due to an on-chain error or rejection.

***

### Replaced

> **Replaced**: `"Replaced"`

Defined in: [packages/pulsar-core/src/types.ts:38](https://github.com/TuwaIO/pulsar-core/blob/60c0779bdb5f397a3581ac6699d8168f97eb6b11/packages/pulsar-core/src/types.ts#L38)

The transaction was replaced by another with the same nonce (e.g., a speed-up or cancel).

***

### Success

> **Success**: `"Success"`

Defined in: [packages/pulsar-core/src/types.ts:36](https://github.com/TuwaIO/pulsar-core/blob/60c0779bdb5f397a3581ac6699d8168f97eb6b11/packages/pulsar-core/src/types.ts#L36)

The transaction was successfully mined and included in a block.
