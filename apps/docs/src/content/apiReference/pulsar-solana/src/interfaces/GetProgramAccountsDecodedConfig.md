[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# GetProgramAccountsDecodedConfig\<T\>

Defined in: [packages/pulsar-solana/src/utils/getProgramAccountsDecoded.ts:24](https://github.com/TuwaIO/pulsar-core/blob/c3ad8144f2008a57a67fac346389a8c64145db47/packages/pulsar-solana/src/utils/getProgramAccountsDecoded.ts#L24)

Extends the basic program account configuration with a decoder for the account data.

## Extends

- [`GetProgramAccountsConfig`](GetProgramAccountsConfig.md)

## Type Parameters

### T

`T` *extends* `object`

The structured object type that the raw account data will be decoded into.

## Properties

### decoder

> **decoder**: `Decoder`\<`T`\>

Defined in: [packages/pulsar-solana/src/utils/getProgramAccountsDecoded.ts:26](https://github.com/TuwaIO/pulsar-core/blob/c3ad8144f2008a57a67fac346389a8c64145db47/packages/pulsar-solana/src/utils/getProgramAccountsDecoded.ts#L26)

The decoder responsible for parsing the raw account data into type `T`.

***

### filter

> **filter**: `string`

Defined in: [packages/pulsar-solana/src/utils/getProgramAccounts.ts:15](https://github.com/TuwaIO/pulsar-core/blob/c3ad8144f2008a57a67fac346389a8c64145db47/packages/pulsar-solana/src/utils/getProgramAccounts.ts#L15)

The Base58 encoded string of bytes to match against the account data.
This is used as the core of the `memcmp` filter.

#### Inherited from

[`GetProgramAccountsConfig`](GetProgramAccountsConfig.md).[`filter`](GetProgramAccountsConfig.md#filter)

***

### programAddress

> **programAddress**: `Address`

Defined in: [packages/pulsar-solana/src/utils/getProgramAccounts.ts:17](https://github.com/TuwaIO/pulsar-core/blob/c3ad8144f2008a57a67fac346389a8c64145db47/packages/pulsar-solana/src/utils/getProgramAccounts.ts#L17)

The public address of the program whose accounts are being queried.

#### Inherited from

[`GetProgramAccountsConfig`](GetProgramAccountsConfig.md).[`programAddress`](GetProgramAccountsConfig.md#programaddress)
