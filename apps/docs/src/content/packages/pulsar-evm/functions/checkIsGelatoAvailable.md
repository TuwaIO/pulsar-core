# ~~checkIsGelatoAvailable()~~

> **checkIsGelatoAvailable**(`chainId`, `gelatoApiKey`): `Promise`\<`boolean`\>

Defined in: [utils/checkIsGelatoAvailable.ts:118](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/checkIsGelatoAvailable.ts#L118)

Checks whether Gelato Relay supports a chain.

Side effects: the first call for an API key sends `relayer_getCapabilities` to the Gelato API (see
[createGelatoClient](/packages/pulsar-evm/functions/createGelatoClient.md)); the result is cached in memory per API key until the page is reloaded. A failed request
is logged, is not cached, and returns `false`.

## Parameters

### chainId

`number`

The chain ID to check.

### gelatoApiKey

`string`

The Gelato API key.

## Returns

`Promise`\<`boolean`\>

`true` if the chain is supported; `false` if it is not or the request failed. Never rejects.

## Deprecated

Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.
