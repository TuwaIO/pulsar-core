[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkIsGelatoAvailable()

> **checkIsGelatoAvailable**(`chainId`): `Promise`\<`boolean`\>

Defined in: [packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts:17](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L17)

Checks if the Gelato Relay service supports a given chain ID.
The result is cached in memory for 5 minutes to avoid excessive network requests.

## Parameters

### chainId

`number`

The chain identifier to check.

## Returns

`Promise`\<`boolean`\>

True if Gelato supports the chain, false otherwise.
