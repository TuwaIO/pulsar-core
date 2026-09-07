[**API Reference.**](../../../README.md)

***

# selectEvmTxExplorerLink()

> **selectEvmTxExplorerLink**\<`T`\>(`params`): `string`

Defined in: [packages/pulsar-evm/src/utils/selectEvmTxExplorerLink.ts:25](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-evm/src/utils/selectEvmTxExplorerLink.ts#L25)

Generates a URL to a block explorer or Safe UI for a given transaction.
It handles different URL structures for standard EVM transactions, Safe multi-sig, and ERC-4337 UserOperations.
Both standard transactions and ERC-4337 UserOperations link to the native block explorer (e.g., Etherscan).

## Type Parameters

### T

`T` *extends* `Transaction`

The transaction type, extending the base `Transaction`.

## Parameters

### params

The parameters for the selection.

#### chains

readonly \[`Chain`, `Chain`\]

An array of supported chain objects, typically from `viem/chains`.

#### tx

`T`

The transaction object for which to generate the link.

## Returns

`string`

The full URL to the transaction on the corresponding block explorer or Safe app,
or an empty string if the transaction or required chain configuration is not found.
