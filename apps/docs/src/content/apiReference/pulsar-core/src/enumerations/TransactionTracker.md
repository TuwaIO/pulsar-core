[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionTracker

Defined in: [packages/pulsar-core/src/types.ts:7](https://github.com/TuwaIO/pulsar-core/blob/e926d5f5ee625996a23d6a30b8f5364a3dbf86df/packages/pulsar-core/src/types.ts#L7)

Enum representing the different tracking strategies available for transactions.
Each tracker corresponds to a specific method of monitoring a transaction's lifecycle.

## Enumeration Members

### Ethereum

> **Ethereum**: `"ethereum"`

Defined in: [packages/pulsar-core/src/types.ts:9](https://github.com/TuwaIO/pulsar-core/blob/e926d5f5ee625996a23d6a30b8f5364a3dbf86df/packages/pulsar-core/src/types.ts#L9)

For standard on-chain EVM transactions tracked by their hash.

***

### Gelato

> **Gelato**: `"gelato"`

Defined in: [packages/pulsar-core/src/types.ts:13](https://github.com/TuwaIO/pulsar-core/blob/e926d5f5ee625996a23d6a30b8f5364a3dbf86df/packages/pulsar-core/src/types.ts#L13)

For meta-transactions relayed and executed by the Gelato Network.

***

### Safe

> **Safe**: `"safe"`

Defined in: [packages/pulsar-core/src/types.ts:11](https://github.com/TuwaIO/pulsar-core/blob/e926d5f5ee625996a23d6a30b8f5364a3dbf86df/packages/pulsar-core/src/types.ts#L11)

For multi-signature transactions managed and executed via a Safe contract.

***

### Solana

> **Solana**: `"solana"`

Defined in: [packages/pulsar-core/src/types.ts:15](https://github.com/TuwaIO/pulsar-core/blob/e926d5f5ee625996a23d6a30b8f5364a3dbf86df/packages/pulsar-core/src/types.ts#L15)

The tracker for monitoring standard Solana transaction signatures.
