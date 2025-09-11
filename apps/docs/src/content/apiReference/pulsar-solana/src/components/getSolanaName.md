[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getSolanaName()

> **getSolanaName**(`connection`, `address`): `Promise`\<`null` \| `string`\>

Defined in: [packages/pulsar-solana/src/utils/snsUtils.ts:36](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-solana/src/utils/snsUtils.ts#L36)

Performs a reverse lookup to find the .sol domain name for a given wallet address.

## Parameters

### connection

`ConnectionContextState`

The connection state object from the `useConnection` hook.

### address

`string`

The public key of the wallet as a string.

## Returns

`Promise`\<`null` \| `string`\>

The .sol domain name (e.g., "bonfida.sol") or null if not found.
