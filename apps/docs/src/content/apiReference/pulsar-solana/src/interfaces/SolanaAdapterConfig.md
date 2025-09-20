[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaAdapterConfig

Defined in: [packages/pulsar-solana/src/types.ts:31](https://github.com/TuwaIO/pulsar-core/blob/5415e11372c5ba1e590020a446666e4f0bb4d82d/packages/pulsar-solana/src/types.ts#L31)

Represents the simplified configuration object for the Solana adapter.

This configuration enables both wallet-based (connected) and read-only (disconnected) modes,
supporting operations like transaction tracking, name/identity resolution, and more.

## Properties

### rpcUrls

> **rpcUrls**: `Partial`\<`Record`\<`SolanaClusterMoniker`, `string`\>\>

Defined in: [packages/pulsar-solana/src/types.ts:33](https://github.com/TuwaIO/pulsar-core/blob/5415e11372c5ba1e590020a446666e4f0bb4d82d/packages/pulsar-solana/src/types.ts#L33)

A mapping of cluster names to their respective RPC endpoints.

***

### wallet?

> `optional` **wallet**: [`SolanaAdapterWallet`](SolanaAdapterWallet.md)

Defined in: [packages/pulsar-solana/src/types.ts:32](https://github.com/TuwaIO/pulsar-core/blob/5415e11372c5ba1e590020a446666e4f0bb4d82d/packages/pulsar-solana/src/types.ts#L32)

An optional object describing the connected wallet's state.
