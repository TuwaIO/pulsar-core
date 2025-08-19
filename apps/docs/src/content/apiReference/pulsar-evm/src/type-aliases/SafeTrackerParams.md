[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SafeTrackerParams

> **SafeTrackerParams** = `Pick`\<`InitializePollingTracker`\<[`SafeTxStatusResponse`](SafeTxStatusResponse.md), `InitialSafeTx`, [`TransactionTracker`](../enumerations/TransactionTracker.md)\>, `"tx"` \| `"removeTxFromPool"` \| `"onInitialize"` \| `"onSucceed"` \| `"onFailed"` \| `"onReplaced"` \| `"onIntervalTick"` \| `"pollingInterval"` \| `"retryCount"`\>

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:52](https://github.com/TuwaIO/pulsar-core/blob/bf888b7cba0c2ed8046a56f4a3dbf1e64f61c8e9/packages/pulsar-evm/src/trackers/safeTracker.ts#L52)

Defines the parameters for the low-level `safeTracker` function.
