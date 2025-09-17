[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectSolanaTxExplorerLink()

> **selectSolanaTxExplorerLink**(`txKey`, `cluster?`): `string`

Defined in: [packages/pulsar-solana/src/utils/selectSolanaTxExplorerLink.ts:15](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-solana/src/utils/selectSolanaTxExplorerLink.ts#L15)

Generates a full URL to a transaction on a Solana explorer like Solscan.

## Parameters

### txKey

`string`

The transaction signature (hash).

### cluster?

`SolanaClusterMoniker`

The optional cluster name ('devnet', 'testnet') to add as a query parameter.

## Returns

`string`

The full URL to the transaction on the explorer.
