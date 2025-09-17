[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaAdapterConfig

Defined in: [packages/pulsar-solana/src/types.ts:31](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-solana/src/types.ts#L31)

Represents the simplified configuration object for the Solana adapter.

This configuration enables both wallet-based (connected) and read-only (disconnected) modes,
supporting operations like transaction tracking, name/identity resolution, and more.

## Properties

### rpcUrls

> **rpcUrls**: `Partial`\<`Record`\<`SolanaClusterMoniker`, `string`\>\>

Defined in: [packages/pulsar-solana/src/types.ts:33](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-solana/src/types.ts#L33)

A mapping of cluster names to their respective RPC endpoints.

***

### wallet?

> `optional` **wallet**: [`SolanaAdapterWallet`](SolanaAdapterWallet.md)

Defined in: [packages/pulsar-solana/src/types.ts:32](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-solana/src/types.ts#L32)

An optional object describing the connected wallet's state.
