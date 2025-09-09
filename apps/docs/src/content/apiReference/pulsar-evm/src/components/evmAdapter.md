[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmAdapter()

> **evmAdapter**\<`T`\>(`config`, `appChains`): `TxAdapter`\<[`TransactionTracker`](../enumerations/TransactionTracker.md), `T`, [`ActionTxKey`](../type-aliases/ActionTxKey.md)\>

Defined in: [packages/pulsar-evm/src/adapters/evmAdapter.ts:33](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-evm/src/adapters/evmAdapter.ts#L33)

Creates an EVM-specific transaction adapter.

This function acts as a constructor for the EVM adapter, bundling all the necessary
chain-specific utilities (like checking chain, speeding up transactions, etc.) into a
single object that conforms to the `TxAdapter` interface required by `@tuwaio/pulsar-core`.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>

The application-specific transaction type.

## Parameters

### config

`Config`

The wagmi configuration object.

### appChains

`Chain`[]

An array of viem `Chain` objects supported by the application.

## Returns

`TxAdapter`\<[`TransactionTracker`](../enumerations/TransactionTracker.md), `T`, [`ActionTxKey`](../type-aliases/ActionTxKey.md)\>

The configured EVM transaction adapter.

## Throws

Throws an error if the wagmi `config` is not provided.
