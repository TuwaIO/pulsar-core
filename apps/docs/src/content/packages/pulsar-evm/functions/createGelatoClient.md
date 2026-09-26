# ~~createGelatoClient()~~

> **createGelatoClient**(`parameters`): `ReturnType`\<`Transport`\>

Defined in: [utils/createGelatoClient.ts:38](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/createGelatoClient.ts#L38)

Creates a viem HTTP transport for `<baseUrl>/rpc` of the Gelato Relay API, authenticated with `apiKey`. The default
timeout is 15 s because Gelato's synchronous relay methods can take up to 10 s.

Side effects: the transport is cached in memory by `apiKey` and `baseUrl` until the page is reloaded; later calls
with the same pair return the cached transport and ignore the other options. Creating it sends no request.

## Parameters

### parameters

[`GelatoClientConfig`](/packages/pulsar-evm/type-aliases/GelatoClientConfig.md)

The API key and transport options.

## Returns

`ReturnType`\<`Transport`\>

The transport; use its `request` method to call the Gelato RPC API.

## Deprecated

Gelato relay is deprecated. Use `TransactionTracker.ERC4337` and `createBundlerRpcClient` from
`@tuwaio/orbit-evm` instead.
