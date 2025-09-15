[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# selectSolanaTxExplorerLink()

> **selectSolanaTxExplorerLink**(`txKey`, `cluster?`): `string`

Defined in: [packages/pulsar-solana/src/utils/selectSolanaTxExplorerLink.ts:15](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-solana/src/utils/selectSolanaTxExplorerLink.ts#L15)

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
