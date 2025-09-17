[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionStatus

Defined in: [packages/pulsar-core/src/types.ts:44](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-core/src/types.ts#L44)

Represents the terminal status of a transaction after it has been processed.

## Enumeration Members

### Failed

> **Failed**: `"Failed"`

Defined in: [packages/pulsar-core/src/types.ts:46](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-core/src/types.ts#L46)

The transaction failed to execute due to an on-chain error or rejection.

***

### Replaced

> **Replaced**: `"Replaced"`

Defined in: [packages/pulsar-core/src/types.ts:50](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-core/src/types.ts#L50)

The transaction was replaced by another with the same nonce (e.g., a speed-up or cancel).

***

### Success

> **Success**: `"Success"`

Defined in: [packages/pulsar-core/src/types.ts:48](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-core/src/types.ts#L48)

The transaction was successfully mined and included in a block.
