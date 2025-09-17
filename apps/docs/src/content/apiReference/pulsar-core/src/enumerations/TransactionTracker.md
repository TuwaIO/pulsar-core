[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionTracker

Defined in: [packages/pulsar-core/src/types.ts:45](https://github.com/TuwaIO/pulsar-core/blob/3ba2d01231ada5db5bd141e51fda8a3427ad1f9d/packages/pulsar-core/src/types.ts#L45)

Enum representing the different tracking strategies available for EVM transactions.
Each tracker corresponds to a specific method of monitoring a transaction's lifecycle.

## Enumeration Members

### Ethereum

> **Ethereum**: `"ethereum"`

Defined in: [packages/pulsar-core/src/types.ts:47](https://github.com/TuwaIO/pulsar-core/blob/3ba2d01231ada5db5bd141e51fda8a3427ad1f9d/packages/pulsar-core/src/types.ts#L47)

For standard on-chain EVM transactions tracked by their hash.

***

### Gelato

> **Gelato**: `"gelato"`

Defined in: [packages/pulsar-core/src/types.ts:51](https://github.com/TuwaIO/pulsar-core/blob/3ba2d01231ada5db5bd141e51fda8a3427ad1f9d/packages/pulsar-core/src/types.ts#L51)

For meta-transactions relayed and executed by the Gelato Network.

***

### Safe

> **Safe**: `"safe"`

Defined in: [packages/pulsar-core/src/types.ts:49](https://github.com/TuwaIO/pulsar-core/blob/3ba2d01231ada5db5bd141e51fda8a3427ad1f9d/packages/pulsar-core/src/types.ts#L49)

For multi-signature transactions managed and executed via a Safe contract.

***

### Solana

> **Solana**: `"solana"`

Defined in: [packages/pulsar-core/src/types.ts:53](https://github.com/TuwaIO/pulsar-core/blob/3ba2d01231ada5db5bd141e51fda8a3427ad1f9d/packages/pulsar-core/src/types.ts#L53)

The tracker for monitoring standard Solana transaction signatures.
