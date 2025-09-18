[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getAvatar()

> **getAvatar**(`name`): `Promise`\<`null` \| `string`\>

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:40](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-evm/src/utils/ensUtils.ts#L40)

Fetches the avatar URL for a given ENS name from the Ethereum Mainnet.

## Parameters

### name

`string`

The ENS name (e.g., 'vitalik.eth').

## Returns

`Promise`\<`null` \| `string`\>

The URL of the avatar image if found, otherwise null.
