[**API Reference.**](../../../README.md)

***

# checkSolanaChain()

> **checkSolanaChain**(`requiredChain`, `currentChain`): `void`

Defined in: [packages/pulsar-solana/src/utils/checkSolanaChain.ts:16](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-solana/src/utils/checkSolanaChain.ts#L16)

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
