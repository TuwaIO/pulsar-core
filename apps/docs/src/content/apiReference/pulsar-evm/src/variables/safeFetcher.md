[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# safeFetcher

> `const` **safeFetcher**: `PollingTrackerConfig`\<[`SafeTxStatusResponse`](../type-aliases/SafeTxStatusResponse.md), `Transaction`\>\[`"fetcher"`\]

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:53](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-evm/src/trackers/safeTracker.ts#L53)

A reusable fetcher for `initializePollingTracker` that queries the Safe Transaction Service API.
It handles the complex logic of detecting executed, failed, and replaced multisig transactions.
