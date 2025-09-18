[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmAdapter()

> **evmAdapter**\<`T`\>(`config`, `appChains`): `TxAdapter`\<`T`\>

Defined in: [packages/pulsar-evm/src/adapters/evmAdapter.ts:33](https://github.com/TuwaIO/pulsar-core/blob/c81eb98e6cdcf718f4d05b7d7444cbfda0dec5d9/packages/pulsar-evm/src/adapters/evmAdapter.ts#L33)

Creates an EVM-specific transaction adapter.

This function acts as a constructor for the EVM adapter, bundling all the necessary
chain-specific utilities (like checking chain, ENS resolution, speeding up transactions, etc.)
into a single object that conforms to the `TxAdapter` interface.

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific transaction type.

## Parameters

### config

`Config`

The wagmi configuration object.

### appChains

`Chain`[]

An array of viem `Chain` objects supported by the application.

## Returns

`TxAdapter`\<`T`\>

The configured EVM transaction adapter.

## Throws

Throws an error if the wagmi `config` is not provided.
