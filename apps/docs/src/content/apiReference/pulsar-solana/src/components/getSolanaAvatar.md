[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getSolanaAvatar()

> **getSolanaAvatar**(`rpcUrl`, `name`): `Promise`\<`null` \| `string`\>

Defined in: [packages/pulsar-solana/src/utils/snsUtils.ts:79](https://github.com/TuwaIO/pulsar-core/blob/e3b3acb31f38fb0ca8440f76b033c6f46b9062cd/packages/pulsar-solana/src/utils/snsUtils.ts#L79)

Retrieves the avatar URL from the 'pic' record of a .sol domain name.

## Parameters

### rpcUrl

`string`

The RPC endpoint URL.

### name

`string`

The .sol domain name (e.g., "bonfida.sol").

## Returns

`Promise`\<`null` \| `string`\>

The URL of the avatar or null if not found or set.
