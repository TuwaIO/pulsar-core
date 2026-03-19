[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# GelatoClientConfig

> **GelatoClientConfig** = `object`

Defined in: [packages/pulsar-evm/src/utils/createGelatoClient.ts:16](https://github.com/TuwaIO/pulsar-core/blob/3bc7ad7f218c235540ef1eb27cc5de5c737dbede/packages/pulsar-evm/src/utils/createGelatoClient.ts#L16)

Configuration options for creating a Gelato API client.

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/pulsar-evm/src/utils/createGelatoClient.ts:17](https://github.com/TuwaIO/pulsar-core/blob/3bc7ad7f218c235540ef1eb27cc5de5c737dbede/packages/pulsar-evm/src/utils/createGelatoClient.ts#L17)

The Gelato API key used for authentication.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/pulsar-evm/src/utils/createGelatoClient.ts:19](https://github.com/TuwaIO/pulsar-core/blob/3bc7ad7f218c235540ef1eb27cc5de5c737dbede/packages/pulsar-evm/src/utils/createGelatoClient.ts#L19)

Optional custom base URL for the Gelato API. Defaults to `https://api.gelato.cloud/rpc`.

***

### httpTransportConfig?

> `optional` **httpTransportConfig**: `HttpTransportConfig`

Defined in: [packages/pulsar-evm/src/utils/createGelatoClient.ts:20](https://github.com/TuwaIO/pulsar-core/blob/3bc7ad7f218c235540ef1eb27cc5de5c737dbede/packages/pulsar-evm/src/utils/createGelatoClient.ts#L20)

Optional additional viem HTTP transport configuration overrides.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/pulsar-evm/src/utils/createGelatoClient.ts:18](https://github.com/TuwaIO/pulsar-core/blob/3bc7ad7f218c235540ef1eb27cc5de5c737dbede/packages/pulsar-evm/src/utils/createGelatoClient.ts#L18)

Optional custom HTTP timeout in milliseconds. Defaults to 15000ms.
