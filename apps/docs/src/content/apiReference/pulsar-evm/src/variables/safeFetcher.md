[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# safeFetcher

> `const` **safeFetcher**: `PollingTrackerConfig`\<[`SafeTxStatusResponse`](../type-aliases/SafeTxStatusResponse.md), `Transaction`\>\[`"fetcher"`\]

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:54](https://github.com/TuwaIO/pulsar-core/blob/5f182e29003409398051d1d02ec9c947396d97e5/packages/pulsar-evm/src/trackers/safeTracker.ts#L54)

A reusable fetcher for `initializePollingTracker` that queries the Safe Transaction Service API.
It handles the complex logic of detecting executed, failed, and replaced multisig transactions.
