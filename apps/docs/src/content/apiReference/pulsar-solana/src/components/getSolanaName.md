[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getSolanaName()

> **getSolanaName**(`rpcUrl`, `address`): `Promise`\<`null` \| `string`\>

Defined in: [packages/pulsar-solana/src/utils/snsUtils.ts:41](https://github.com/TuwaIO/pulsar-core/blob/588f0298eed13d576622f00b75515bcca31625e2/packages/pulsar-solana/src/utils/snsUtils.ts#L41)

Performs a reverse lookup to find the .sol domain name for a given wallet address.
Results are cached to avoid redundant network requests.

## Parameters

### rpcUrl

`string`

The RPC endpoint URL.

### address

`string`

The public key of the wallet as a string.

## Returns

`Promise`\<`null` \| `string`\>

The .sol domain name (e.g., "bonfida.sol") or null if not found.
