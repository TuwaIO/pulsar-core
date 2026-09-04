[**API Reference.**](../../../README.md)

***

# erc4337Fetcher()

> **erc4337Fetcher**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:47](https://github.com/TuwaIO/pulsar-core/blob/18e5da55b3b8542aa1cb462dd015c6097e4ec4f0/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L47)

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
