[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkIsGelatoAvailable()

> **checkIsGelatoAvailable**(`chainId`, `gelatoApiKey`): `Promise`\<`boolean`\>

Defined in: [packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts:114](https://github.com/TuwaIO/pulsar-core/blob/ec1fbdb65038124be29ff74cedf250a5f8ff704f/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L114)

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
