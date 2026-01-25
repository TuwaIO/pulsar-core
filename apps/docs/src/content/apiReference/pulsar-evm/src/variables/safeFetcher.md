[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# safeFetcher

> `const` **safeFetcher**: `PollingTrackerConfig`\<[`SafeTxStatusResponse`](../type-aliases/SafeTxStatusResponse.md), `Transaction`\>\[`"fetcher"`\]

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:54](https://github.com/TuwaIO/pulsar-core/blob/2945b2501ed48311a673ca82e77467e5176a417d/packages/pulsar-evm/src/trackers/safeTracker.ts#L54)

A reusable fetcher for `initializePollingTracker` that queries the Safe Transaction Service API.
It handles the complex logic of detecting executed, failed, and replaced multisig transactions.
