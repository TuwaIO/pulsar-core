[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaAdapter()

> **solanaAdapter**\<`T`\>(`config`): `TxAdapter`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana), `T`, `string`\>

Defined in: [packages/pulsar-solana/src/adapters/solanaAdapter.ts:25](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-solana/src/adapters/solanaAdapter.ts#L25)

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
