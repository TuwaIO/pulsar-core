[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# isSolanaChain()

> **isSolanaChain**(`chainId`): `boolean`

Defined in: [packages/pulsar-core/src/utils/сhainHelpers.ts:8](https://github.com/TuwaIO/pulsar-core/blob/a7be35a2b7622d9fa673537aeeda8b529d9c752a/packages/pulsar-core/src/utils/сhainHelpers.ts#L8)

Checks whether the given chain ID belongs to a Solana network.
Supports common Solana network names: 'devnet', 'testnet', 'mainnet-beta', 'mainnet'.

## Parameters

### chainId

The chain ID or chain name.

`string` | `number`

## Returns

`boolean`

- True if the chain ID corresponds to a Solana network, false otherwise.
