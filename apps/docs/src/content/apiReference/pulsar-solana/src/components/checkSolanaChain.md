[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkSolanaChain()

> **checkSolanaChain**(`rpcUrl`, `requiredCluster`): `Promise`\<`void`\>

Defined in: [packages/pulsar-solana/src/utils/checkSolanaChain.ts:26](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-solana/src/utils/checkSolanaChain.ts#L26)

Checks if an RPC endpoint is connected to the required Solana cluster.
It fetches the genesis hash from the RPC endpoint and compares it
with a known hash for the specified cluster.

## Parameters

### rpcUrl

`string`

The RPC endpoint URL to check.

### requiredCluster

[`SolanaCluster`](../type-aliases/SolanaCluster.md)

The cluster that the transaction requires (e.g., 'mainnet-beta').

## Returns

`Promise`\<`void`\>

## Throws

If the connected chain does not match the required cluster.

## Throws

If the cluster name is unknown or if the RPC call fails for other reasons.
