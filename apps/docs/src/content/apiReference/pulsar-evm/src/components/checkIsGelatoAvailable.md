[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkIsGelatoAvailable()

> **checkIsGelatoAvailable**(`chainId`, `gelatoApiKey`): `Promise`\<`boolean`\>

Defined in: [packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts:114](https://github.com/TuwaIO/pulsar-core/blob/df64e6e2a3068f5625f2d13b70fb044828dcd8ee/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L114)

Checks if the Gelato Relay service supports a given chain ID.

This function fetches the relay capabilities via the authenticated Gelato RPC client
(`relayer_getCapabilities`) and checks whether the specified chain is present in the response.
Results are cached in memory per API key for the lifetime of the application to minimize network requests.

## Parameters

### chainId

`number`

The chain identifier to check.

### gelatoApiKey

`string`

The Gelato API key used for authentication.

## Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if Gelato supports the chain, `false` otherwise.
