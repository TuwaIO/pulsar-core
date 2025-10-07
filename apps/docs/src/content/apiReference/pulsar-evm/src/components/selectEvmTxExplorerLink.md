[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectEvmTxExplorerLink()

> **selectEvmTxExplorerLink**\<`T`\>(`params`): `string`

Defined in: [packages/pulsar-evm/src/utils/selectEvmTxExplorerLink.ts:26](https://github.com/TuwaIO/pulsar-core/blob/caf1ba2505ed5457b6e964538da515a51e0d6bdf/packages/pulsar-evm/src/utils/selectEvmTxExplorerLink.ts#L26)

Generates a URL to a block explorer or Safe UI for a given transaction.
It handles different URL structures for standard EVM transactions and Safe multi-sig transactions.

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

## Returns

`string`

The full URL to the transaction on the corresponding block explorer or Safe app,
or an empty string if the transaction or required chain configuration is not found.
