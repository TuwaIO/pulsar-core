# initializePollingTracker()

> **initializePollingTracker**\<`R`, `T`\>(`config`): `void`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:172](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L172)

Starts polling a transaction in the background and returns immediately. Does nothing if `tx.pending` is `false`.

Every `pollingInterval` milliseconds (the first attempt also waits; a function is asked before each wait) it calls
`fetcher`. Polling continues until the
fetcher calls `stopPolling`. A fetcher that throws counts as a failed attempt; after `maxRetries` consecutive failed
attempts the tracker calls `onFailure()` without arguments, logs a warning and stops (which calls
`removeTxFromPool`, if configured), or, with `retryForeverEveryMs`, keeps asking at that delay. A successful attempt
resets the count. A [FinalPollingError](/packages/pulsar-core/classes/FinalPollingError.md) ends it at once. An error thrown by a callback is logged and is not a
failed attempt, as the fetcher would then report the same result again on the next tick.

Side effects: runs a timer loop until it is stopped; from the outside only `isAbandoned` can end it.

## Type Parameters

### R

`R`

The response type the fetcher reports.

### T

`T` *extends* `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"pending"` \| `"txKey"`\>

The tracked transaction type.

## Parameters

### config

[`PollingTrackerConfig`](/packages/pulsar-core/type-aliases/PollingTrackerConfig.md)\<`R`, `T`\>

The transaction, the fetcher and the callbacks.

## Returns

`void`

## Example

```ts
initializePollingTracker<string, { txKey: string; pending: boolean }>({
  tx: { txKey: taskId, pending: true },
  fetcher: async ({ tx, stopPolling, onSuccess, onFailure }) => {
    const status = await getTaskStatus(tx.txKey); // your API call; throw on network errors
    if (status === 'done') onSuccess(status);
    if (status === 'failed') onFailure(status);
    if (status !== 'pending') stopPolling({ withoutRemoving: true });
  },
  onSuccess: () => console.log('Done'),
  onFailure: () => console.log('Failed'),
});
```
