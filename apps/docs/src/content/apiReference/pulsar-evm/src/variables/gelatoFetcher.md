[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# gelatoFetcher

> `const` **gelatoFetcher**: `PollingTrackerConfig`\<[`GelatoTaskStatusResponse`](../type-aliases/GelatoTaskStatusResponse.md), `Transaction`\>\[`"fetcher"`\]

Defined in: [packages/pulsar-evm/src/trackers/gelatoTracker.ts:86](https://github.com/TuwaIO/pulsar-core/blob/e56d20196785cbd4bdaac53127d472f3ae8dfd10/packages/pulsar-evm/src/trackers/gelatoTracker.ts#L86)

A reusable fetcher function for `initializePollingTracker` that queries the Gelato API for a task's status.
It handles the logic for interpreting Gelato's task states and calls the appropriate polling callbacks.
