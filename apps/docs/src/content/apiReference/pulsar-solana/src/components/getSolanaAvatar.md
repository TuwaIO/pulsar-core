[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getSolanaAvatar()

> **getSolanaAvatar**(`connection`, `name`): `Promise`\<`null` \| `string`\>

Defined in: [packages/pulsar-solana/src/utils/snsUtils.ts:62](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-solana/src/utils/snsUtils.ts#L62)

Retrieves the avatar URL from the 'pic' record of a .sol domain name.

## Parameters

### connection

`ConnectionContextState`

The connection state object from the `useConnection` hook.

### name

`string`

The .sol domain name (e.g., "bonfida.sol").

## Returns

`Promise`\<`null` \| `string`\>

The URL of the avatar or null if not found or set.
