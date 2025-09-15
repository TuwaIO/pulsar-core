[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaAdapterConfig

Defined in: [packages/pulsar-solana/src/types.ts:24](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-solana/src/types.ts#L24)

The final, simplified configuration object for the solanaAdapter.

## Properties

### rpcUrls

> **rpcUrls**: `Record`\<`Partial`\<`SolanaClusterMoniker`\>, `string`\>

Defined in: [packages/pulsar-solana/src/types.ts:26](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-solana/src/types.ts#L26)

A map of RPC URLs for each supported Solana cluster.

***

### wallet?

> `optional` **wallet**: [`SolanaAdapterWallet`](SolanaAdapterWallet.md)

Defined in: [packages/pulsar-solana/src/types.ts:25](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-solana/src/types.ts#L25)

A simple object representing the current state of the user's wallet.
