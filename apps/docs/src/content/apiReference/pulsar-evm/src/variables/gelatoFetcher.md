[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# gelatoFetcher

> `const` **gelatoFetcher**: `PollingTrackerConfig`\<[`GelatoTaskStatusResponse`](../type-aliases/GelatoTaskStatusResponse.md), `Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>, [`TransactionTracker`](../enumerations/TransactionTracker.md)\>\[`"fetcher"`\]

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:92](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L92)

A reusable fetcher function for `initializePollingTracker` that queries the Gelato API for a task's status.
It handles the logic for interpreting Gelato's task states and calls the appropriate polling callbacks.
