# initializePollingTracker()

> **initializePollingTracker**\<`R`, `T`\>(`config`): `void`

Defined in: [utils/initializePollingTracker.ts:130](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L130)

Starts polling a transaction in the background and returns immediately. Does nothing if `tx.pending` is `false`.

Every `pollingInterval` milliseconds (the first attempt also waits) it calls `fetcher`. Polling continues until the
fetcher calls `stopPolling`. A fetcher that throws counts as a failed attempt; after `maxRetries` consecutive failed
attempts the tracker calls `onFailure()` without arguments, logs a warning and stops (which calls
`removeTxFromPool`, if configured). A successful attempt resets the count.

Side effects: runs a timer loop until it is stopped; there is no way to cancel it from the outside.

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
