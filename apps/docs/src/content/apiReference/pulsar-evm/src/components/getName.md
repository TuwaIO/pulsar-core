[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getName()

> **getName**(`address`): `Promise`\<`null` \| `string`\>

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:23](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-evm/src/utils/ensUtils.ts#L23)

Fetches the primary ENS name for a given Ethereum address from the Ethereum Mainnet.

## Parameters

### address

`` `0x${string}` ``

The Ethereum address to look up.

## Returns

`Promise`\<`null` \| `string`\>

The ENS name if found, otherwise null.
