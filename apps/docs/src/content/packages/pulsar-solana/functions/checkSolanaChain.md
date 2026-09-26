# checkSolanaChain()

> **checkSolanaChain**(`requiredChain`, `currentChain`): `void`

Defined in: [utils/checkSolanaChain.ts:16](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/utils/checkSolanaChain.ts#L16)

Checks that two cluster identifiers are equal. The comparison is exact, so pass both in the same format: the Solana
adapter removes a `solana:` prefix from `desiredChainID` and from the cluster saved for the connection before calling
it, so `devnet` and `solana:devnet` match there.

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
