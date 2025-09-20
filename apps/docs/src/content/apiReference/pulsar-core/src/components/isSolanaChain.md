[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# isSolanaChain()

> **isSolanaChain**(`chainId`): `boolean`

Defined in: [packages/pulsar-core/src/utils/сhainHelpers.ts:8](https://github.com/TuwaIO/pulsar-core/blob/5415e11372c5ba1e590020a446666e4f0bb4d82d/packages/pulsar-core/src/utils/сhainHelpers.ts#L8)

Checks whether the given chain ID belongs to a Solana network.
Supports common Solana network names: 'devnet', 'testnet', 'mainnet-beta', 'mainnet'.

## Parameters

### chainId

The chain ID or chain name.

`string` | `number`

## Returns

`boolean`

- True if the chain ID corresponds to a Solana network, false otherwise.
