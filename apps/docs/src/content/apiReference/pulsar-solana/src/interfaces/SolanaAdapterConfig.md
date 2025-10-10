[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaAdapterConfig

Defined in: [packages/pulsar-solana/src/types.ts:15](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-solana/src/types.ts#L15)

Represents the simplified configuration object for the Solana adapter.

This configuration enables both wallet-based (connected) and read-only (disconnected) modes,
supporting operations like transaction tracking, name/identity resolution, and more.

## Properties

### rpcUrls

> **rpcUrls**: `Partial`\<`Record`\<`SolanaClusterMoniker`, `string`\>\>

Defined in: [packages/pulsar-solana/src/types.ts:16](https://github.com/TuwaIO/pulsar-core/blob/fb805c8a985eeff730f01b9c69cab18b0026a187/packages/pulsar-solana/src/types.ts#L16)

A mapping of cluster names to their respective RPC endpoints.
