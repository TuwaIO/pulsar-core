[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# setChainId()

> **setChainId**(`chainId`): `string` \| `number`

Defined in: [packages/pulsar-core/src/utils/сhainHelpers.ts:21](https://github.com/TuwaIO/pulsar-core/blob/698c5eb23be9ded1ac04d2ceef0aaddf6f1229e1/packages/pulsar-core/src/utils/сhainHelpers.ts#L21)

Sets the chain ID to a Solana-specific format if the chain is a Solana network.

## Parameters

### chainId

The original chain ID or name.

`string` | `number`

## Returns

`string` \| `number`

- The formatted chain ID prefixed with 'solana:' if Solana, otherwise the original.
