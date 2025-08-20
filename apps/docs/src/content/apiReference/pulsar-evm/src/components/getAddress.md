[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getAddress()

> **getAddress**(`name`): `Promise`\<`undefined` \| `` `0x${string}` ``\>

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:59](https://github.com/TuwaIO/pulsar-core/blob/06efb81e25851de10cd682c9a7c240a3c9cbde6f/packages/pulsar-evm/src/utils/ensUtils.ts#L59)

Fetches the Ethereum address associated with a given ENS name.
Performs the lookup on Ethereum Mainnet.

## Parameters

### name

`string`

The ENS name to resolve (e.g., 'vitalik.eth').

## Returns

`Promise`\<`undefined` \| `` `0x${string}` ``\>

The associated Ethereum address (lowercase) or undefined if not found.
