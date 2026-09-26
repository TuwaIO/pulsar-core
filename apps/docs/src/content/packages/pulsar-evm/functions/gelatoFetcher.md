# ~~gelatoFetcher()~~

> **gelatoFetcher**(`client`): (`params`) => `Promise`\<`void`\>

Defined in: [trackers/gelatoTracker.ts:113](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L113)

Creates a fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that checks a Gelato task (`tx.txKey`)
once through `relayer_getStatus`.

On every tick it calls `onIntervalTick` with the status. [GelatoStatusCode.Success](/packages/pulsar-evm/enumerations/GelatoStatusCode.md#success) calls `onSuccess`;
[GelatoStatusCode.Rejected](/packages/pulsar-evm/enumerations/GelatoStatusCode.md#rejected) and [GelatoStatusCode.Reverted](/packages/pulsar-evm/enumerations/GelatoStatusCode.md#reverted) call `onFailure`; both stop polling and keep
the transaction. A task still pending one hour after `createdAt` calls `onFailure` with its status and stops polling,
keeping the transaction. Request errors are thrown, so the polling tracker counts them as failed attempts.

## Parameters

### client

A transport created by [createGelatoClient](/packages/pulsar-evm/functions/createGelatoClient.md).

## Returns

The fetcher.

(`params`) => `Promise`\<`void`\>

## Deprecated

Gelato relay is deprecated. Use `TransactionTracker.ERC4337` and [erc4337Fetcher](/packages/pulsar-evm/functions/erc4337Fetcher.md) instead.
