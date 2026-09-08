[**API Reference.**](../../../README.md)

***

# TransactionTracker

Defined in: [packages/pulsar-core/src/types.ts:18](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-core/src/types.ts#L18)

Enum representing the different tracking strategies available for transactions.
Each tracker corresponds to a specific method of monitoring a transaction's lifecycle.

## Enumeration Members

### ERC4337

> **ERC4337**: `"erc4337"`

Defined in: [packages/pulsar-core/src/types.ts:31](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-core/src/types.ts#L31)

For native ERC-4337 UserOperation transactions tracked via bundler RPC.

***

### Ethereum

> **Ethereum**: `"ethereum"`

Defined in: [packages/pulsar-core/src/types.ts:20](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-core/src/types.ts#L20)

For standard on-chain EVM transactions tracked by their hash.

***

### ~~Gelato~~

> **Gelato**: `"gelato"`

Defined in: [packages/pulsar-core/src/types.ts:27](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-core/src/types.ts#L27)

For meta-transactions relayed and executed by the Gelato Network.

#### Deprecated

Gelato gasless relay is deprecated. Use TransactionTracker.ERC4337 instead.

***

### Safe

> **Safe**: `"safe"`

Defined in: [packages/pulsar-core/src/types.ts:22](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-core/src/types.ts#L22)

For multi-signature transactions managed and executed via a Safe contract.

***

### Solana

> **Solana**: `"solana"`

Defined in: [packages/pulsar-core/src/types.ts:29](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-core/src/types.ts#L29)

The tracker for monitoring standard Solana transaction signatures.
