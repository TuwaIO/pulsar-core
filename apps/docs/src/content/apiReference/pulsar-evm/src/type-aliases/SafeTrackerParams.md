[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SafeTrackerParams

> **SafeTrackerParams** = `Pick`\<`InitializePollingTracker`\<[`SafeTxStatusResponse`](SafeTxStatusResponse.md), `InitialSafeTx`, [`TransactionTracker`](../enumerations/TransactionTracker.md)\>, `"tx"` \| `"removeTxFromPool"` \| `"onInitialize"` \| `"onSucceed"` \| `"onFailed"` \| `"onReplaced"` \| `"onIntervalTick"` \| `"pollingInterval"` \| `"retryCount"`\>

Defined in: [packages/pulsar-evm/src/trackers/safeTracker.ts:52](https://github.com/TuwaIO/pulsar-core/blob/3dd99361d439c3516b34d795b4c0fe6affcc943c/packages/pulsar-evm/src/trackers/safeTracker.ts#L52)

Defines the parameters for the low-level `safeTracker` function.
