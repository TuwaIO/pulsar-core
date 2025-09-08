[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getAvatar()

> **getAvatar**(`name`): `Promise`\<`undefined` \| `string`\>

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:41](https://github.com/TuwaIO/pulsar-core/blob/d3c1cd2bf3c4ee994c97e3b17aa8ea73c2cbc70f/packages/pulsar-evm/src/utils/ensUtils.ts#L41)

Fetches the avatar for a given ENS name.
Performs the lookup on Ethereum Mainnet.

## Parameters

### name

`string`

The ENS name (e.g., 'vitalik.eth').

## Returns

`Promise`\<`undefined` \| `string`\>

The URL of the avatar image or undefined if an error occurs.
