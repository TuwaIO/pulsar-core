[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# GetProgramAccountsConfig

Defined in: [packages/pulsar-solana/src/utils/getProgramAccounts.ts:10](https://github.com/TuwaIO/pulsar-core/blob/c3ad8144f2008a57a67fac346389a8c64145db47/packages/pulsar-solana/src/utils/getProgramAccounts.ts#L10)

Defines the configuration required for fetching program accounts with a memcmp filter.

## Extended by

- [`GetProgramAccountsDecodedConfig`](GetProgramAccountsDecodedConfig.md)

## Properties

### filter

> **filter**: `string`

Defined in: [packages/pulsar-solana/src/utils/getProgramAccounts.ts:15](https://github.com/TuwaIO/pulsar-core/blob/c3ad8144f2008a57a67fac346389a8c64145db47/packages/pulsar-solana/src/utils/getProgramAccounts.ts#L15)

The Base58 encoded string of bytes to match against the account data.
This is used as the core of the `memcmp` filter.

***

### programAddress

> **programAddress**: `Address`

Defined in: [packages/pulsar-solana/src/utils/getProgramAccounts.ts:17](https://github.com/TuwaIO/pulsar-core/blob/c3ad8144f2008a57a67fac346389a8c64145db47/packages/pulsar-solana/src/utils/getProgramAccounts.ts#L17)

The public address of the program whose accounts are being queried.
