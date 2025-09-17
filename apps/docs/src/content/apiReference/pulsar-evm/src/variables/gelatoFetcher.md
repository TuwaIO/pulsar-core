[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# gelatoFetcher

> `const` **gelatoFetcher**: `PollingTrackerConfig`\<[`GelatoTaskStatusResponse`](../type-aliases/GelatoTaskStatusResponse.md), `Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>, [`TransactionTracker`](../enumerations/TransactionTracker.md)\>\[`"fetcher"`\]

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:92](https://github.com/TuwaIO/pulsar-core/blob/e4e6c80b06717a36e79850d69c03d964005053f1/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L92)

A reusable fetcher function for `initializePollingTracker` that queries the Gelato API for a task's status.
It handles the logic for interpreting Gelato's task states and calls the appropriate polling callbacks.
