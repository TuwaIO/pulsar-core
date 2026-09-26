# safeFetcher()

> **safeFetcher**(`params`): `Promise`\<`void`\>

Defined in: [trackers/safeTracker.ts:78](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L78)

A fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that checks a Safe multisig transaction once
through the Safe Transaction Service API of `tx.chainId` ([SafeTransactionServiceUrls](/packages/pulsar-evm/variables/SafeTransactionServiceUrls.md)). `tx.txKey` is the
`safeTxHash` and `tx.from` the Safe address.

Requests: `GET <service>/multisig-transactions/<safeTxHash>/`, and while it is not executed,
`GET <service>/safes/<from>/multisig-transactions/?nonce=<nonce>`.

- Executed: calls `onSuccess` or `onFailure` (by `isSuccessful`) and stops polling, keeping the transaction.
- Another transaction with the same nonce was executed: calls `onReplaced` with it and stops polling, keeping the
  transaction.
- Still pending one day after `submissionDate`: calls `onFailure` with the status and stops polling, keeping the
  transaction.
- The service returns 404: calls `onFailure()` without a response and stops polling, keeping the transaction.
- An unsupported chain or another failed request throws, so the polling tracker counts it as a failed attempt.

## Parameters

### params

[`PollingFetcherParams`](/packages/pulsar-core/type-aliases/PollingFetcherParams.md)\<[`SafeTxStatusResponse`](/packages/pulsar-evm/type-aliases/SafeTxStatusResponse.md), `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"chainId"` \| `"from"` \| `"txKey"`\>\>

The fetcher parameters provided by `initializePollingTracker`.

## Returns

`Promise`\<`void`\>

A promise that resolves when the check is done.
