[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# pulsarSolanaAdapter()

> **pulsarSolanaAdapter**\<`T`\>(`config`): `TxAdapter`\<`T`\>

Defined in: [packages/pulsar-solana/src/adapters/solanaAdapter.ts:35](https://github.com/TuwaIO/pulsar-core/blob/36ff61e9e8d908e475c7475f7c6c5f5fe7eec72c/packages/pulsar-solana/src/adapters/solanaAdapter.ts#L35)

Creates a Solana adapter for the Pulsar transaction tracking engine.
This factory function produces a wallet-library-agnostic adapter that can be
configured for multiple Solana clusters (e.g., mainnet-beta, devnet) and
can operate even without a connected wallet for read-only tasks.

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific transaction type.

## Parameters

### config

[`SolanaAdapterConfig`](../interfaces/SolanaAdapterConfig.md)

The configuration object for the adapter.

## Returns

`TxAdapter`\<`T`\>

The configured Solana transaction adapter.

## Throws

Throws an error if the wagmi `config` is not provided.
