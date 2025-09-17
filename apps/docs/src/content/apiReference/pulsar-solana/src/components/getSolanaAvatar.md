[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getSolanaAvatar()

> **getSolanaAvatar**(`rpcUrl`, `name`): `Promise`\<`null` \| `string`\>

Defined in: [packages/pulsar-solana/src/utils/snsUtils.ts:79](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-solana/src/utils/snsUtils.ts#L79)

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
