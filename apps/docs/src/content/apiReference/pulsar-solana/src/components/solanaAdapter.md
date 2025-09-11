[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# solanaAdapter()

> **solanaAdapter**\<`T`\>(`config`): `TxAdapter`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana), `T`, `string`\>

Defined in: [packages/pulsar-solana/src/adapters/solanaAdapter.ts:22](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-solana/src/adapters/solanaAdapter.ts#L22)

Factory function to create a Solana adapter for Pulsar.
This adapter provides all the necessary logic to interact with the Solana ecosystem,
including wallet interactions, transaction tracking, and name services.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana)\>

## Parameters

### config

[`SolanaAdapterConfig`](../interfaces/SolanaAdapterConfig.md)

The configuration object, typically derived from Solana wallet adapter hooks.

## Returns

`TxAdapter`\<[`Solana`](../enumerations/SolanaTransactionTracker.md#solana), `T`, `string`\>

An object conforming to the `TxAdapter` interface.
