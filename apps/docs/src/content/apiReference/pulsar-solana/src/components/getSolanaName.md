[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getSolanaName()

> **getSolanaName**(`rpcUrl`, `address`): `Promise`\<`null` \| `string`\>

Defined in: [packages/pulsar-solana/src/utils/snsUtils.ts:41](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-solana/src/utils/snsUtils.ts#L41)

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
