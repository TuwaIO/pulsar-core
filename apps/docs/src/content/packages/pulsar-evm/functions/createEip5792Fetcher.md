# createEip5792Fetcher()

> **createEip5792Fetcher**(`config`): \<`T`\>(`__namedParameters`) => `Promise`\<`void`\>

Defined in: [trackers/eip5792Tracker.ts:63](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L63)

Creates a fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that asks the connected wallet once for
the status of an EIP-5792 call batch (`getCallsStatus` of `@wagmi/core`, `wallet_getCallsStatus`). The status comes
from the wallet, not from a public RPC: the wallet that sent the batch must be connected in `config`.

- Pending: calls `onIntervalTick` with `status: 'pending'`.
- Executed with every receipt `success`: stops polling (keeping the transaction) and calls `onSuccess` with the hash
  of the last receipt.
- Failed (status codes 400, 500, 600) or a reverted receipt: stops polling (keeping the transaction) and calls
  `onFailure` with the reason and the hash, if any.
- An error (no connected wallet, a wallet without EIP-5792) is rethrown, so the polling tracker counts it as a failed
  attempt.

## Parameters

### config

`Config`

The wagmi config with the wallet that sent the batch.

## Returns

The fetcher.

\<`T`\>(`__namedParameters`) => `Promise`\<`void`\>
