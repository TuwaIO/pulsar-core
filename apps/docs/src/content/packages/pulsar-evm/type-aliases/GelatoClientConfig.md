# ~~GelatoClientConfig~~

> **GelatoClientConfig** = `object`

Defined in: [utils/createGelatoClient.ts:12](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/createGelatoClient.ts#L12)

The configuration of [createGelatoClient](/packages/pulsar-evm/functions/createGelatoClient.md).

## Deprecated

Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.

## Properties

### ~~apiKey~~

> **apiKey**: `string`

Defined in: [utils/createGelatoClient.ts:14](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/createGelatoClient.ts#L14)

The Gelato API key, sent as a `Bearer` token.

***

### ~~baseUrl?~~

> `optional` **baseUrl?**: `string`

Defined in: [utils/createGelatoClient.ts:18](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/createGelatoClient.ts#L18)

The base URL of the Gelato API; `/rpc` is appended. Defaults to `https://api.gelato.cloud`.

***

### ~~httpTransportConfig?~~

> `optional` **httpTransportConfig?**: `HttpTransportConfig`

Defined in: [utils/createGelatoClient.ts:20](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/createGelatoClient.ts#L20)

Additional options for viem's `http` transport. Its `timeout` overrides `timeout`.

***

### ~~timeout?~~

> `optional` **timeout?**: `number`

Defined in: [utils/createGelatoClient.ts:16](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/createGelatoClient.ts#L16)

HTTP timeout in milliseconds. Defaults to 15000.
