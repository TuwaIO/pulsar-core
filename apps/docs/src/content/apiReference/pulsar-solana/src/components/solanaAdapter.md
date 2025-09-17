[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaAdapter()

> **solanaAdapter**\<`T`\>(`config`): `TxAdapter`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana), `T`, `string`\>

Defined in: [packages/pulsar-solana/src/adapters/solanaAdapter.ts:25](https://github.com/TuwaIO/pulsar-core/blob/e4e6c80b06717a36e79850d69c03d964005053f1/packages/pulsar-solana/src/adapters/solanaAdapter.ts#L25)

Creates a Solana adapter for the Pulsar transaction tracking engine.
This factory function produces a wallet-library-agnostic adapter that can be
configured for multiple Solana clusters (e.g., mainnet-beta, devnet) and
can operate even without a connected wallet for read-only tasks.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana)\>

## Parameters

### config

[`SolanaAdapterConfig`](../interfaces/SolanaAdapterConfig.md)

The configuration object for the adapter.

## Returns

`TxAdapter`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana), `T`, `string`\>

An object implementing the `TxAdapter` interface for Solana.
