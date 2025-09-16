[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getProgramAccounts()

> **getProgramAccounts**(`rpc`, `config`): `Promise`\<`Readonly`\<\{ `account`: `Readonly`\<\{ `executable`: `boolean`; `lamports`: `Lamports`; `owner`: `Address`; `rentEpoch`: `bigint`; `space`: `bigint`; \}\> & `Readonly`\<\{ `data`: `Base64EncodedDataResponse` \| `Readonly`\<\{ `parsed`: \{ `info?`: ...; `type`: ...; \}; `program`: `string`; `space`: `bigint`; \}\>; \}\>; `pubkey`: `Address`; \}\>[]\>

Defined in: [packages/pulsar-solana/src/utils/getProgramAccounts.ts:39](https://github.com/TuwaIO/pulsar-core/blob/c3ad8144f2008a57a67fac346389a8c64145db47/packages/pulsar-solana/src/utils/getProgramAccounts.ts#L39)

Fetches program accounts and filters them based on a memory comparison (`memcmp`).

This function is a wrapper around the `getProgramAccounts` RPC method, pre-configured
to use a `memcmp` filter at offset 0. It's useful for finding all accounts
that start with a specific sequence of bytes (e.g., a discriminator for an account type).

## Parameters

### rpc

`Rpc`\<`SolanaRpcApiForTestClusters`\>

The Solana RPC client instance from the `gill` library.

### config

[`GetProgramAccountsConfig`](../interfaces/GetProgramAccountsConfig.md)

The configuration object containing the program address and the filter bytes.

## Returns

`Promise`\<`Readonly`\<\{ `account`: `Readonly`\<\{ `executable`: `boolean`; `lamports`: `Lamports`; `owner`: `Address`; `rentEpoch`: `bigint`; `space`: `bigint`; \}\> & `Readonly`\<\{ `data`: `Base64EncodedDataResponse` \| `Readonly`\<\{ `parsed`: \{ `info?`: ...; `type`: ...; \}; `program`: `string`; `space`: `bigint`; \}\>; \}\>; `pubkey`: `Address`; \}\>[]\>

A promise that resolves with the RPC response containing the filtered accounts.

## Throws

Will throw an error if the RPC call fails.

## Example

```ts
const accounts = await getProgramAccounts(rpc, {
programAddress: '...program_address...',
filter: '...base58_encoded_discriminator...',
});
console.log('Found accounts:', accounts);
```
