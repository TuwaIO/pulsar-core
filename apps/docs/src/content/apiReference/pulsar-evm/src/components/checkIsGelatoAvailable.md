[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkIsGelatoAvailable()

> **checkIsGelatoAvailable**(`chainId`): `Promise`\<`boolean`\>

Defined in: [packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts:20](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L20)

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
