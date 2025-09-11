[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectSolanaTxExplorerLink()

> **selectSolanaTxExplorerLink**(`baseUrl`, `txKey`, `cluster?`): `string`

Defined in: [packages/pulsar-solana/src/utils/selectSolanaTxExplorerLink.ts:15](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-solana/src/utils/selectSolanaTxExplorerLink.ts#L15)

Generates a full URL to a transaction on a Solana explorer like Solscan.

## Parameters

### baseUrl

`string`

The base URL of the explorer (e.g., "https://solscan.io").

### txKey

`string`

The transaction signature (hash).

### cluster?

[`SolanaCluster`](../type-aliases/SolanaCluster.md)

The optional cluster name ('devnet', 'testnet') to add as a query parameter.

## Returns

`string`

The full URL to the transaction on the explorer.
