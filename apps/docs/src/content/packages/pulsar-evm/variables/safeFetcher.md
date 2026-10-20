# safeFetcher

> `const` **safeFetcher**: (`__namedParameters`) => `Promise`\<`void`\>

Defined in: [trackers/safeTracker.ts:198](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L198)

[createSafeFetcher](/packages/pulsar-evm/functions/createSafeFetcher.md) with the default options: gives up one day after the transaction was proposed.

## Parameters

### \_\_namedParameters

[`PollingFetcherParams`](/packages/pulsar-core/type-aliases/PollingFetcherParams.md)\<[`SafeTxStatusResponse`](/packages/pulsar-evm/type-aliases/SafeTxStatusResponse.md), `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"chainId"` \| `"from"` \| `"txKey"`\>\>

## Returns

`Promise`\<`void`\>
