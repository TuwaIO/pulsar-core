# createSafeFetcher()

> **createSafeFetcher**(`options?`): (`__namedParameters`) => `Promise`\<`void`\>

Defined in: [trackers/safeTracker.ts:131](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L131)

Creates a fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that checks a Safe multisig transaction once
through the Safe Transaction Service API of `tx.chainId` ([SafeTransactionServiceUrls](/packages/pulsar-evm/variables/SafeTransactionServiceUrls.md)). `tx.txKey` is the
`safeTxHash` and `tx.from` the Safe address.

Requests: `GET <service>/multisig-transactions/<safeTxHash>/`, and while it is not executed,
`GET <service>/safes/<from>/multisig-transactions/?nonce=<nonce>`.

- Executed: calls `onSuccess` or `onFailure` (by `isSuccessful`) and stops polling, keeping the transaction.
- Another transaction with the same nonce was executed: calls `onReplaced` with it and stops polling, keeping the
  transaction.
- Still pending `pendingTimeoutMs` after `submissionDate` (one day by default): calls `onFailure` with the status
  and stops polling, keeping the transaction. Without a timeout (`null`) it keeps waiting.
- The service returns 404: calls `onFailure()` without a response and stops polling, keeping the transaction.
- An unsupported chain or another failed request throws, so the polling tracker counts it as a failed attempt.

## Parameters

### options?

[`SafeTrackerOptions`](/packages/pulsar-evm/type-aliases/SafeTrackerOptions.md) = `{}`

The tracker options.

## Returns

The fetcher. Its promise resolves when the check is done.

(`__namedParameters`) => `Promise`\<`void`\>
