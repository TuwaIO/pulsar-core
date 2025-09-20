[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkIsGelatoAvailable()

> **checkIsGelatoAvailable**(`chainId`): `Promise`\<`boolean`\>

Defined in: [packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts:20](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L20)

Checks if the Gelato Relay service supports a given chain ID.

This function fetches the list of supported chain IDs from the Gelato API and
caches the result in memory for 5 minutes to reduce network requests.

## Parameters

### chainId

`number`

The chain identifier to check.

## Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if Gelato supports the chain, `false` otherwise.
