[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getAvatar()

> **getAvatar**(`name`): `Promise`\<`null` \| `string`\>

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:40](https://github.com/TuwaIO/pulsar-core/blob/ec5ee833ca939943dee97a8e5938dc68d269fd66/packages/pulsar-evm/src/utils/ensUtils.ts#L40)

Fetches the avatar URL for a given ENS name from the Ethereum Mainnet.

## Parameters

### name

`string`

The ENS name (e.g., 'vitalik.eth').

## Returns

`Promise`\<`null` \| `string`\>

The URL of the avatar image if found, otherwise null.
