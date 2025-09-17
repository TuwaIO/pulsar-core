[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionTracker

Defined in: [packages/pulsar-evm/src/types.ts:15](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-evm/src/types.ts#L15)

Enum representing the different tracking strategies available for EVM transactions.
Each tracker corresponds to a specific method of monitoring a transaction's lifecycle.

## Enumeration Members

### Ethereum

> **Ethereum**: `"ethereum"`

Defined in: [packages/pulsar-evm/src/types.ts:17](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-evm/src/types.ts#L17)

For standard on-chain EVM transactions tracked by their hash.

***

### Gelato

> **Gelato**: `"gelato"`

Defined in: [packages/pulsar-evm/src/types.ts:21](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-evm/src/types.ts#L21)

For meta-transactions relayed and executed by the Gelato Network.

***

### Safe

> **Safe**: `"safe"`

Defined in: [packages/pulsar-evm/src/types.ts:19](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-evm/src/types.ts#L19)

For multi-signature transactions managed and executed via a Safe contract.
