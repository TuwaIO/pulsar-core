[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmAdapter()

> **evmAdapter**\<`T`\>(`config`, `appChains`): `TxAdapter`\<[`TransactionTracker`](../enumerations/TransactionTracker.md), `T`, [`ActionTxKey`](../type-aliases/ActionTxKey.md)\>

Defined in: [packages/pulsar-evm/src/adapters/evmAdapter.ts:21](https://github.com/TuwaIO/pulsar-core/blob/5e6e1f83790e94bf45cb45e22ff57cc8acc0effd/packages/pulsar-evm/src/adapters/evmAdapter.ts#L21)

Creates an EVM-specific transaction adapter that provides utilities to manage transactions and interact with chains.

## Type Parameters

### T

`T` *extends* `Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>

## Parameters

### config

`Config`

The configuration object for the Wagmi library, required to initialize the adapter.

### appChains

`Chain`[]

An array of available chain configurations for the application.

## Returns

`TxAdapter`\<[`TransactionTracker`](../enumerations/TransactionTracker.md), `T`, [`ActionTxKey`](../type-aliases/ActionTxKey.md)\>

The EVM transaction adapter with methods to interact with chains and transactions.

## Throws

Throws an error when the configuration object is not provided .
