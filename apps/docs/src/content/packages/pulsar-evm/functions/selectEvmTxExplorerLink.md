# selectEvmTxExplorerLink()

> **selectEvmTxExplorerLink**\<`T`\>(`params`): `string`

Defined in: [utils/selectEvmTxExplorerLink.ts:24](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/selectEvmTxExplorerLink.ts#L24)

Builds the URL of a transaction page:
- Safe transactions link to the transaction in the Safe web app ([gnosisSafeLinksHelper](/packages/pulsar-evm/variables/gnosisSafeLinksHelper.md)).
- Other transactions link to `<explorer>/tx/<hash>` on the default block explorer of the chain in `chains`, where
  `<hash>` is `replacedTxHash`, else `hash`, else `txKey`. Before an ERC-4337 UserOperation is bundled, this is the
  `userOpHash`, which block explorers do not know.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

The chains and the transaction.

#### chains

readonly \[`Chain`, `Chain`\]

The viem chains of the app.

#### tx

`T`

The transaction.

## Returns

`string`

The URL, or an empty string when the chain or its explorer is not configured.
