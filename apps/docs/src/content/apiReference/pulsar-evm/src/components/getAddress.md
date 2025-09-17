[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getAddress()

> **getAddress**(`name`): `Promise`\<`null` \| `` `0x${string}` ``\>

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:57](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-evm/src/utils/ensUtils.ts#L57)

Fetches the Ethereum address associated with a given ENS name from the Ethereum Mainnet.

## Parameters

### name

`string`

The ENS name to resolve (e.g., 'vitalik.eth').

## Returns

`Promise`\<`null` \| `` `0x${string}` ``\>

The associated Ethereum address (lowercase) or null if not found.
