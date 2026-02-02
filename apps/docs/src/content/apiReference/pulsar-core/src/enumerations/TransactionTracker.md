[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionTracker

Defined in: [packages/pulsar-core/src/types.ts:18](https://github.com/TuwaIO/pulsar-core/blob/1a6191eb282f8d2973c1d4cac3e8ee819324de5e/packages/pulsar-core/src/types.ts#L18)

Enum representing the different tracking strategies available for transactions.
Each tracker corresponds to a specific method of monitoring a transaction's lifecycle.

## Enumeration Members

### Ethereum

> **Ethereum**: `"ethereum"`

Defined in: [packages/pulsar-core/src/types.ts:20](https://github.com/TuwaIO/pulsar-core/blob/1a6191eb282f8d2973c1d4cac3e8ee819324de5e/packages/pulsar-core/src/types.ts#L20)

For standard on-chain EVM transactions tracked by their hash.

***

### Gelato

> **Gelato**: `"gelato"`

Defined in: [packages/pulsar-core/src/types.ts:24](https://github.com/TuwaIO/pulsar-core/blob/1a6191eb282f8d2973c1d4cac3e8ee819324de5e/packages/pulsar-core/src/types.ts#L24)

For meta-transactions relayed and executed by the Gelato Network.

***

### Safe

> **Safe**: `"safe"`

Defined in: [packages/pulsar-core/src/types.ts:22](https://github.com/TuwaIO/pulsar-core/blob/1a6191eb282f8d2973c1d4cac3e8ee819324de5e/packages/pulsar-core/src/types.ts#L22)

For multi-signature transactions managed and executed via a Safe contract.

***

### Solana

> **Solana**: `"solana"`

Defined in: [packages/pulsar-core/src/types.ts:26](https://github.com/TuwaIO/pulsar-core/blob/1a6191eb282f8d2973c1d4cac3e8ee819324de5e/packages/pulsar-core/src/types.ts#L26)

The tracker for monitoring standard Solana transaction signatures.
