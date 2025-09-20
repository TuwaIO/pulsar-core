[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionTracker

Defined in: [packages/pulsar-core/src/types.ts:43](https://github.com/TuwaIO/pulsar-core/blob/581af0fd8f6d32e377a9308802bc37dd710e7877/packages/pulsar-core/src/types.ts#L43)

Enum representing the different tracking strategies available for transactions.
Each tracker corresponds to a specific method of monitoring a transaction's lifecycle.

## Enumeration Members

### Ethereum

> **Ethereum**: `"ethereum"`

Defined in: [packages/pulsar-core/src/types.ts:45](https://github.com/TuwaIO/pulsar-core/blob/581af0fd8f6d32e377a9308802bc37dd710e7877/packages/pulsar-core/src/types.ts#L45)

For standard on-chain EVM transactions tracked by their hash.

***

### Gelato

> **Gelato**: `"gelato"`

Defined in: [packages/pulsar-core/src/types.ts:49](https://github.com/TuwaIO/pulsar-core/blob/581af0fd8f6d32e377a9308802bc37dd710e7877/packages/pulsar-core/src/types.ts#L49)

For meta-transactions relayed and executed by the Gelato Network.

***

### Safe

> **Safe**: `"safe"`

Defined in: [packages/pulsar-core/src/types.ts:47](https://github.com/TuwaIO/pulsar-core/blob/581af0fd8f6d32e377a9308802bc37dd710e7877/packages/pulsar-core/src/types.ts#L47)

For multi-signature transactions managed and executed via a Safe contract.

***

### Solana

> **Solana**: `"solana"`

Defined in: [packages/pulsar-core/src/types.ts:51](https://github.com/TuwaIO/pulsar-core/blob/581af0fd8f6d32e377a9308802bc37dd710e7877/packages/pulsar-core/src/types.ts#L51)

The tracker for monitoring standard Solana transaction signatures.
