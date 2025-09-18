[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionStatus

Defined in: [packages/pulsar-core/src/types.ts:59](https://github.com/TuwaIO/pulsar-core/blob/227594b111c3b7431fc1b2bfe3380cc9ee0fa156/packages/pulsar-core/src/types.ts#L59)

Represents the terminal status of a transaction after it has been processed.

## Enumeration Members

### Failed

> **Failed**: `"Failed"`

Defined in: [packages/pulsar-core/src/types.ts:61](https://github.com/TuwaIO/pulsar-core/blob/227594b111c3b7431fc1b2bfe3380cc9ee0fa156/packages/pulsar-core/src/types.ts#L61)

The transaction failed to execute due to an on-chain error or rejection.

***

### Replaced

> **Replaced**: `"Replaced"`

Defined in: [packages/pulsar-core/src/types.ts:65](https://github.com/TuwaIO/pulsar-core/blob/227594b111c3b7431fc1b2bfe3380cc9ee0fa156/packages/pulsar-core/src/types.ts#L65)

The transaction was replaced by another with the same nonce (e.g., a speed-up or cancel).

***

### Success

> **Success**: `"Success"`

Defined in: [packages/pulsar-core/src/types.ts:63](https://github.com/TuwaIO/pulsar-core/blob/227594b111c3b7431fc1b2bfe3380cc9ee0fa156/packages/pulsar-core/src/types.ts#L63)

The transaction was successfully mined and included in a block.
