[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaAdapterConfig

Defined in: [packages/pulsar-solana/src/types.ts:24](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-solana/src/types.ts#L24)

The final, simplified configuration object for the solanaAdapter.

## Properties

### rpcUrls

> **rpcUrls**: `Record`\<`Partial`\<`SolanaClusterMoniker`\>, `string`\>

Defined in: [packages/pulsar-solana/src/types.ts:26](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-solana/src/types.ts#L26)

A map of RPC URLs for each supported Solana cluster.

***

### wallet?

> `optional` **wallet**: [`SolanaAdapterWallet`](SolanaAdapterWallet.md)

Defined in: [packages/pulsar-solana/src/types.ts:25](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-solana/src/types.ts#L25)

A simple object representing the current state of the user's wallet.
