[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaAdapterWallet

Defined in: [packages/pulsar-solana/src/types.ts:16](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-solana/src/types.ts#L16)

Represents the essential wallet information required by the Solana adapter.
This interface provides a simple, library-agnostic abstraction for wallet connections,
enabling integration with any wallet library that meets these basic requirements.

## Properties

### walletActiveChain

> **walletActiveChain**: `SolanaClusterMoniker`

Defined in: [packages/pulsar-solana/src/types.ts:19](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-solana/src/types.ts#L19)

The current chain or cluster the wallet is connected to.

***

### walletAddress

> **walletAddress**: `string`

Defined in: [packages/pulsar-solana/src/types.ts:17](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-solana/src/types.ts#L17)

The public address of the connected wallet on Solana.

***

### walletType

> **walletType**: `string`

Defined in: [packages/pulsar-solana/src/types.ts:18](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-solana/src/types.ts#L18)

The type or name of the wallet (e.g., 'Phantom', 'Solflare').
