[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectEvmTxExplorerLink()

> **selectEvmTxExplorerLink**\<`TR`, `T`\>(`transactionsPool`, `chains`, `txKey`, `replacedTxHash?`): `string`

Defined in: [packages/pulsar-evm/src/utils/selectEvmTxExplorerLink.ts:19](https://github.com/TuwaIO/pulsar-core/blob/c240bb5d3e8c1654c70ed6317097503807beff23/packages/pulsar-evm/src/utils/selectEvmTxExplorerLink.ts#L19)

Generates a URL to a block explorer for a given transaction.
It handles different URL structures for standard EVM transactions and Safe transactions.

## Type Parameters

### TR

`TR`

The generic type for the tracker identifier.

### T

`T` *extends* `Transaction`\<`TR`\>

The transaction type.

## Parameters

### transactionsPool

`TransactionPool`\<`TR`, `T`\>

The entire pool of transactions from the store.

### chains

`Chain`[]

An array of supported chain objects from viem.

### txKey

`` `0x${string}` ``

The tx key of the transaction for which to generate the link.

### replacedTxHash?

`` `0x${string}` ``

Optional. If provided, the link will be generated for this hash instead of the original.

## Returns

`string`

The URL to the transaction on the corresponding block explorer, or an empty string if not found.
