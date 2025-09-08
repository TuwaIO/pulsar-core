[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getAvatar()

> **getAvatar**(`name`): `Promise`\<`undefined` \| `string`\>

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:41](https://github.com/TuwaIO/pulsar-core/blob/5e6e1f83790e94bf45cb45e22ff57cc8acc0effd/packages/pulsar-evm/src/utils/ensUtils.ts#L41)

Fetches the avatar for a given ENS name.
Performs the lookup on Ethereum Mainnet.

## Parameters

### name

`string`

The ENS name (e.g., 'vitalik.eth').

## Returns

`Promise`\<`undefined` \| `string`\>

The URL of the avatar image or undefined if an error occurs.
