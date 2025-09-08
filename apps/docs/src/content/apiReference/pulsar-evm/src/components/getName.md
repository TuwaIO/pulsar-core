[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getName()

> **getName**(`address`): `Promise`\<`undefined` \| `string`\>

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:23](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-evm/src/utils/ensUtils.ts#L23)

Fetches the primary ENS name for a given Ethereum address.
Performs the lookup on Ethereum Mainnet.

## Parameters

### address

`` `0x${string}` ``

The Ethereum address to look up.

## Returns

`Promise`\<`undefined` \| `string`\>

The ENS name if found, otherwise undefined.
