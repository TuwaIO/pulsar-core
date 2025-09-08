[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getAddress()

> **getAddress**(`name`): `Promise`\<`undefined` \| `` `0x${string}` ``\>

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:59](https://github.com/TuwaIO/pulsar-core/blob/5e6e1f83790e94bf45cb45e22ff57cc8acc0effd/packages/pulsar-evm/src/utils/ensUtils.ts#L59)

Fetches the Ethereum address associated with a given ENS name.
Performs the lookup on Ethereum Mainnet.

## Parameters

### name

`string`

The ENS name to resolve (e.g., 'vitalik.eth').

## Returns

`Promise`\<`undefined` \| `` `0x${string}` ``\>

The associated Ethereum address (lowercase) or undefined if not found.
