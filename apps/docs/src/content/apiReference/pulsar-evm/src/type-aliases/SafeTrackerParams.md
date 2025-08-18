[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SafeTrackerParams

> **SafeTrackerParams** = `Pick`\<`InitializePollingTracker`\<[`SafeTxStatusResponse`](SafeTxStatusResponse.md), `InitialSafeTx`, [`TransactionTracker`](../enumerations/TransactionTracker.md)\>, `"tx"` \| `"removeTxFromPool"` \| `"onInitialize"` \| `"onSucceed"` \| `"onFailed"` \| `"onReplaced"` \| `"onIntervalTick"` \| `"pollingInterval"` \| `"retryCount"`\>

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:52](https://github.com/TuwaIO/pulsar-core/blob/1b4300a614d84f49e2f240cc8a629dd932f3f73b/packages/pulsar-evm/src/trackers/safeTracker.ts#L52)

Defines the parameters for the low-level `safeTracker` function.
