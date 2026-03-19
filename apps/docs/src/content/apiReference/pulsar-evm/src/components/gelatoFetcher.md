[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# gelatoFetcher()

> **gelatoFetcher**(`client`): (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:110](https://github.com/TuwaIO/pulsar-core/blob/820bd4fc4144158cb642b3967328e54bb81e2fb3/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L110)

Creates a reusable fetcher function for `initializePollingTracker` that queries the
Gelato RPC endpoint (`relayer_getStatus`) for a task's status using an authenticated client.

The fetcher interprets the numeric status codes and calls the appropriate polling callbacks:
- [GelatoStatusCode.Success](../enumerations/GelatoStatusCode.md#success) → `onSuccess`
- [GelatoStatusCode.Rejected](../enumerations/GelatoStatusCode.md#rejected) / [GelatoStatusCode.Reverted](../enumerations/GelatoStatusCode.md#reverted) → `onFailure`
- [GelatoStatusCode.Submitted](../enumerations/GelatoStatusCode.md#submitted) → `onIntervalTick` (to update the tx hash)

## Parameters

### client

A viem transport client configured for the Gelato API.

#### config

`TransportConfig`\<`string`\>

#### request

`EIP1193RequestFn`

#### value?

`Record`\<`string`, `any`\>

## Returns

The fetcher function.

> (`params`): `Promise`\<`void`\>

### Parameters

#### params

`PollingFetcherParams`\<[`GelatoTaskStatus`](../type-aliases/GelatoTaskStatus.md), `Transaction`\>

### Returns

`Promise`\<`void`\>
