[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createGelatoClient()

> **createGelatoClient**(`parameters`): `object`

Defined in: [packages/pulsar-evm/src/utils/createGelatoClient.ts:42](https://github.com/TuwaIO/pulsar-core/blob/8be19767362bf473366bbca846b06a4e9e0f99de/packages/pulsar-evm/src/utils/createGelatoClient.ts#L42)

Creates or retrieves a cached viem HTTP transport client configured for the Gelato Relay API.

The client is cached by a composite key of `apiKey` and `baseUrl` to avoid
creating redundant transport instances for identical configurations.

The default HTTP timeout is set to 15 seconds (instead of viem's default) because
Gelato's synchronous relay methods may take up to 10 seconds on the server side,
and the client should not time out before the server does.

## Parameters

### parameters

[`GelatoClientConfig`](../type-aliases/GelatoClientConfig.md)

The configuration for the Gelato client.

## Returns

`object`

A viem transport instance configured for the Gelato API.

### config

> **config**: `TransportConfig`\<`string`\>

### request

> **request**: `EIP1193RequestFn`

### value?

> `optional` **value?**: `Record`\<`string`, `any`\>
