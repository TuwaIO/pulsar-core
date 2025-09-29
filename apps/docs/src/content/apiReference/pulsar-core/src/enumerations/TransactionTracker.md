[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionTracker

Defined in: [packages/pulsar-core/src/types.ts:7](https://github.com/TuwaIO/pulsar-core/blob/4eac4e83b9ab20a969d3d6ed318d5cf54201efe3/packages/pulsar-core/src/types.ts#L7)

Enum representing the different tracking strategies available for transactions.
Each tracker corresponds to a specific method of monitoring a transaction's lifecycle.

## Enumeration Members

### Ethereum

> **Ethereum**: `"ethereum"`

Defined in: [packages/pulsar-core/src/types.ts:9](https://github.com/TuwaIO/pulsar-core/blob/4eac4e83b9ab20a969d3d6ed318d5cf54201efe3/packages/pulsar-core/src/types.ts#L9)

For standard on-chain EVM transactions tracked by their hash.

***

### Gelato

> **Gelato**: `"gelato"`

Defined in: [packages/pulsar-core/src/types.ts:13](https://github.com/TuwaIO/pulsar-core/blob/4eac4e83b9ab20a969d3d6ed318d5cf54201efe3/packages/pulsar-core/src/types.ts#L13)

For meta-transactions relayed and executed by the Gelato Network.

***

### Safe

> **Safe**: `"safe"`

Defined in: [packages/pulsar-core/src/types.ts:11](https://github.com/TuwaIO/pulsar-core/blob/4eac4e83b9ab20a969d3d6ed318d5cf54201efe3/packages/pulsar-core/src/types.ts#L11)

For multi-signature transactions managed and executed via a Safe contract.

***

### Solana

> **Solana**: `"solana"`

Defined in: [packages/pulsar-core/src/types.ts:15](https://github.com/TuwaIO/pulsar-core/blob/4eac4e83b9ab20a969d3d6ed318d5cf54201efe3/packages/pulsar-core/src/types.ts#L15)

The tracker for monitoring standard Solana transaction signatures.
