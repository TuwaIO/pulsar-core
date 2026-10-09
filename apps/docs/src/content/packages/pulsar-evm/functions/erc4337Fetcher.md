# erc4337Fetcher()

> **erc4337Fetcher**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [trackers/erc4337Tracker.ts:68](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L68)

A fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that checks a UserOperation once through
`eth_getUserOperationReceipt`.

The bundler client comes from `createBundlerRpcClient` of `@tuwaio/orbit-evm`, which caches it in memory and
contacts `tx.bundlerUrl`, else `api.pimlico.io` with `tx.pimlicoApiKey`, else the rate-limited `public.pimlico.io`.

- Invalid `chainId`: stops polling (keeping the transaction) and calls `onFailure` with a reason.
- Receipt not available yet: calls `onIntervalTick` with `status: 'pending'`.
- Receipt with `success: true`: stops polling (keeping the transaction) and calls `onSuccess` with the bundle `hash`.
- Receipt with `success: false`: stops polling (keeping the transaction) and calls `onFailure` with the revert reason.
- Any other error is rethrown, so the polling tracker counts it as a failed attempt.

## Type Parameters

### T

`T` *extends* [`Erc4337FetcherTx`](/packages/pulsar-evm/type-aliases/Erc4337FetcherTx.md)

The tracked transaction type.

## Parameters

### params

[`PollingFetcherParams`](/packages/pulsar-core/type-aliases/PollingFetcherParams.md)\<[`Erc4337FetchResult`](/packages/pulsar-evm/type-aliases/Erc4337FetchResult.md), `T`\>

The fetcher parameters provided by `initializePollingTracker`.

## Returns

`Promise`\<`void`\>

A promise that resolves when the check is done.
