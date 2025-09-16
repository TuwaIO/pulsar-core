[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getProgramAccountsDecoded()

> **getProgramAccountsDecoded**\<`T`\>(`rpc`, `config`): `Promise`\<`Account`\<`T`, `string`\>[]\>

Defined in: [packages/pulsar-solana/src/utils/getProgramAccountsDecoded.ts:53](https://github.com/TuwaIO/pulsar-core/blob/c3ad8144f2008a57a67fac346389a8c64145db47/packages/pulsar-solana/src/utils/getProgramAccountsDecoded.ts#L53)

Fetches program accounts, filters them, and decodes their data into a structured format.

This function builds on `getProgramAccounts` by adding a decoding step. It is useful
for retrieving and immediately working with typed account data without manual parsing.

## Type Parameters

### T

`T` *extends* `object`

The object type to which the account data will be decoded.

## Parameters

### rpc

`Rpc`\<`SolanaRpcApiForTestClusters`\>

The Solana RPC client instance from the `gill` library.

### config

[`GetProgramAccountsDecodedConfig`](../interfaces/GetProgramAccountsDecodedConfig.md)\<`T`\>

The configuration, including the program address, filter, and a data decoder.

## Returns

`Promise`\<`Account`\<`T`, `string`\>[]\>

A promise that resolves to an array of fully decoded program accounts.

## Throws

Will throw an error if the RPC call or the decoding process fails.

## Example

```ts
// Assume `myAccountDecoder` is a valid Decoder<MyAccountType>
const decodedAccounts = await getProgramAccountsDecoded(rpc, {
programAddress: '...program_address...',
filter: '...base58_encoded_discriminator...',
decoder: myAccountDecoder,
});

for (const account of decodedAccounts) {
console.log('Decoded data:', account.data); // account.data is now of type MyAccountType
}
```
