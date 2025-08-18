[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getAvatar()

> **getAvatar**(`name`): `Promise`\<`undefined` \| `string`\>

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:43](https://github.com/TuwaIO/pulsar-core/blob/dbbc3a2abf86991b161bee65372e50210926b49f/packages/pulsar-evm/src/utils/ensUtils.ts#L43)

Fetches the avatar for a given ENS name.
If no ENS avatar is set, it generates a unique "blockie" image as a fallback.
Performs the lookup on Ethereum Mainnet.

## Parameters

### name

`string`

The ENS name (e.g., 'vitalik.eth').

## Returns

`Promise`\<`undefined` \| `string`\>

The URL of the avatar image, a base64 blockie, or undefined if an error occurs.
