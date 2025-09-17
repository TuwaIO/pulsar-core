[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getAddress()

> **getAddress**(`name`): `Promise`\<`null` \| `` `0x${string}` ``\>

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:57](https://github.com/TuwaIO/pulsar-core/blob/f426f4bfc26016d7fbea4fd9c0d9ff73fe1677fe/packages/pulsar-evm/src/utils/ensUtils.ts#L57)

Fetches the Ethereum address associated with a given ENS name from the Ethereum Mainnet.

## Parameters

### name

`string`

The ENS name to resolve (e.g., 'vitalik.eth').

## Returns

`Promise`\<`null` \| `` `0x${string}` ``\>

The associated Ethereum address (lowercase) or null if not found.
