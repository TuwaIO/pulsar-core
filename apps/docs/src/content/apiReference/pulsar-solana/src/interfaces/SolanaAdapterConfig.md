[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaAdapterConfig

Defined in: [packages/pulsar-solana/src/types.ts:24](https://github.com/TuwaIO/pulsar-core/blob/494f4105ae0c6206b7fb474bf50e2b00399fd8c0/packages/pulsar-solana/src/types.ts#L24)

The final, simplified configuration object for the solanaAdapter.

## Properties

### rpcUrls

> **rpcUrls**: `Record`\<`SolanaClusterMoniker`, `string`\>

Defined in: [packages/pulsar-solana/src/types.ts:26](https://github.com/TuwaIO/pulsar-core/blob/494f4105ae0c6206b7fb474bf50e2b00399fd8c0/packages/pulsar-solana/src/types.ts#L26)

A map of RPC URLs for each supported Solana cluster.

***

### wallet?

> `optional` **wallet**: [`SolanaAdapterWallet`](SolanaAdapterWallet.md)

Defined in: [packages/pulsar-solana/src/types.ts:25](https://github.com/TuwaIO/pulsar-core/blob/494f4105ae0c6206b7fb474bf50e2b00399fd8c0/packages/pulsar-solana/src/types.ts#L25)

A simple object representing the current state of the user's wallet.
