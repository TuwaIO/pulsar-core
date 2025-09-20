[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# setChainId()

> **setChainId**(`chainId`): `string` \| `number`

Defined in: [packages/pulsar-core/src/utils/сhainHelpers.ts:21](https://github.com/TuwaIO/pulsar-core/blob/5415e11372c5ba1e590020a446666e4f0bb4d82d/packages/pulsar-core/src/utils/сhainHelpers.ts#L21)

Sets the chain ID to a Solana-specific format if the chain is a Solana network.

## Parameters

### chainId

The original chain ID or name.

`string` | `number`

## Returns

`string` \| `number`

- The formatted chain ID prefixed with 'solana:' if Solana, otherwise the original.
