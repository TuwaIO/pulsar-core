[**API Reference.**](../../../README.md)

***

# erc4337Fetcher()

> **erc4337Fetcher**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:47](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L47)

Low-level fetcher for ERC-4337 UserOperation status.
Queries `eth_getUserOperationReceipt` on the configured Bundler client.

## Type Parameters

### T

`T` *extends* `Transaction`

## Parameters

### params

`PollingFetcherParams`\<[`Erc4337FetchResult`](../type-aliases/Erc4337FetchResult.md)\>

The fetcher parameters provided by the polling tracker.

## Returns

`Promise`\<`void`\>
