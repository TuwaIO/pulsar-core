[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkSolanaChain()

> **checkSolanaChain**(`requiredChain`, `currentChain`): `void`

Defined in: [packages/pulsar-solana/src/utils/checkSolanaChain.ts:17](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-solana/src/utils/checkSolanaChain.ts#L17)

Checks if the wallet's current chain matches the required chain for a transaction.

This function compares the `chain` property from the Wallet Standard account object
with the required chain identifier (e.g., 'solana:mainnet').

## Parameters

### requiredChain

`string`

The chain identifier that the transaction requires.

### currentChain

`string`

The chain identifier the wallet is currently connected to.

## Returns

`void`

## Throws

If the connected chain does not match the required chain.
