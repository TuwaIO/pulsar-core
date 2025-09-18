[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getSolanaExplorerLink()

> **getSolanaExplorerLink**(`url?`, `cluster?`): `string`

Defined in: [packages/pulsar-solana/src/utils/getSolanaExplorerLink.ts:14](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-solana/src/utils/getSolanaExplorerLink.ts#L14)

Generates a full URL to a transaction on a Solana explorer like Solscan.

## Parameters

### url?

`string`

The url after baseUrl.

### cluster?

`SolanaClusterMoniker`

The optional cluster name ('devnet', 'testnet') to add as a query parameter.

## Returns

`string`

The full URL to the transaction on the explorer.
