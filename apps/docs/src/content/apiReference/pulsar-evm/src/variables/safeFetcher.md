[**API Reference.**](../../../README.md)

***

# safeFetcher

> `const` **safeFetcher**: `PollingTrackerConfig`\<[`SafeTxStatusResponse`](../type-aliases/SafeTxStatusResponse.md), `Transaction`\>\[`"fetcher"`\]

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:54](https://github.com/TuwaIO/pulsar-core/blob/c009e922cecf941d1fcdf2f75b06344c7f83e79e/packages/pulsar-evm/src/trackers/safeTracker.ts#L54)

A reusable fetcher for `initializePollingTracker` that queries the Safe Transaction Service API.
It handles the complex logic of detecting executed, failed, and replaced multisig transactions.
