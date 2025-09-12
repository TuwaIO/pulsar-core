[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectEvmTxExplorerLink()

> **selectEvmTxExplorerLink**\<`TR`, `T`\>(`transactionsPool`, `chains`, `txKey`, `replacedTxHash?`): `string`

Defined in: [packages/pulsar-evm/src/utils/selectEvmTxExplorerLink.ts:26](https://github.com/TuwaIO/pulsar-core/blob/494f4105ae0c6206b7fb474bf50e2b00399fd8c0/packages/pulsar-evm/src/utils/selectEvmTxExplorerLink.ts#L26)

Generates a URL to a block explorer or Safe UI for a given transaction.
It handles different URL structures for standard EVM transactions and Safe multi-sig transactions.

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

An array of supported chain objects, typically from `viem/chains`.

### txKey

`` `0x${string}` ``

The unique key (`txKey`) of the transaction for which to generate the link.

### replacedTxHash?

`` `0x${string}` ``

Optional. If this is a speed-up/cancel transaction, this is the hash of the new transaction.

## Returns

`string`

The full URL to the transaction on the corresponding block explorer or Safe app,
or an empty string if the transaction or required chain configuration is not found.
