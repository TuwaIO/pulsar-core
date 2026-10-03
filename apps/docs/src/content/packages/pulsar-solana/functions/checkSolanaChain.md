# checkSolanaChain()

> **checkSolanaChain**(`requiredChain`, `currentChain`): `void`

Defined in: [utils/checkSolanaChain.ts:16](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/utils/checkSolanaChain.ts#L16)

Checks that two cluster identifiers are equal. The comparison is exact, so pass both in the same format: the Solana
adapter turns `desiredChainID` and the cluster saved for the connection into cluster monikers with `getCluster` from
`@tuwaio/orbit-solana` before calling it, so `devnet`, `solana:devnet` and the genesis-hash chain ID match there.

## Parameters

### requiredChain

`string`

The cluster the transaction requires.

### currentChain

`string`

The cluster the wallet is connected to.

## Returns

`void`

## Throws

[SolanaChainMismatchError](/packages/pulsar-solana/classes/SolanaChainMismatchError.md) when they differ.
