[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getAddress()

> **getAddress**(`name`): `Promise`\<`null` \| `` `0x${string}` ``\>

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:57](https://github.com/TuwaIO/pulsar-core/blob/b6b6c3a1756747dcac62deff3f3b4bb3716a2405/packages/pulsar-evm/src/utils/ensUtils.ts#L57)

Fetches the Ethereum address associated with a given ENS name from the Ethereum Mainnet.

## Parameters

### name

`string`

The ENS name to resolve (e.g., 'vitalik.eth').

## Returns

`Promise`\<`null` \| `` `0x${string}` ``\>

The associated Ethereum address (lowercase) or null if not found.
