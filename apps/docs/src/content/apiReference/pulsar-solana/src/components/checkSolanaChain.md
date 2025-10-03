[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkSolanaChain()

> **checkSolanaChain**(`requiredChain`, `currentChain`): `void`

Defined in: [packages/pulsar-solana/src/utils/checkSolanaChain.ts:17](https://github.com/TuwaIO/pulsar-core/blob/0303e0cc6e70e6cb5b5f7acf1bc92cc6f2599cca/packages/pulsar-solana/src/utils/checkSolanaChain.ts#L17)

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
