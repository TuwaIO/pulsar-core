[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaAdapterConfig

Defined in: [packages/pulsar-solana/src/types.ts:15](https://github.com/TuwaIO/pulsar-core/blob/86c8fdb539eb00427d06ed808054f92cd1a1cac1/packages/pulsar-solana/src/types.ts#L15)

Represents the simplified configuration object for the Solana adapter.

This configuration enables both wallet-based (connected) and read-only (disconnected) modes,
supporting operations like transaction tracking, name/identity resolution, and more.

## Properties

### rpcUrls

> **rpcUrls**: `Partial`\<`Record`\<`SolanaClusterMoniker`, `string`\>\>

Defined in: [packages/pulsar-solana/src/types.ts:16](https://github.com/TuwaIO/pulsar-core/blob/86c8fdb539eb00427d06ed808054f92cd1a1cac1/packages/pulsar-solana/src/types.ts#L16)

A mapping of cluster names to their respective RPC endpoints.
