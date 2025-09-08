[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SafeTrackerParams

> **SafeTrackerParams** = `Pick`\<`InitializePollingTracker`\<[`SafeTxStatusResponse`](SafeTxStatusResponse.md), `InitialSafeTx`, [`TransactionTracker`](../enumerations/TransactionTracker.md)\>, `"tx"` \| `"removeTxFromPool"` \| `"onInitialize"` \| `"onSucceed"` \| `"onFailed"` \| `"onReplaced"` \| `"onIntervalTick"` \| `"pollingInterval"` \| `"retryCount"`\>

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:52](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-evm/src/trackers/safeTracker.ts#L52)

Defines the parameters for the low-level `safeTracker` function.
