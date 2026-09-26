# evmTracker()

> **evmTracker**(`params`): `Promise`\<`void`\>

Defined in: [trackers/evmTracker.ts:178](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L178)

Tracks a standard EVM transaction by its hash, without a store. Use it to track transactions in your own state or on
a server.

Steps (all RPC calls go through the wagmi client of `tx.chainId`):
1. Calls `onInitialize`. Fails at once for the zero hash or when there is no client for the chain.
2. Calls `getTransaction` up to `retryCount` times, `retryTimeout` ms apart, so a transaction the node has not
   indexed yet is still found; then calls `onTxDetailsFetched`.
3. Waits for the receipt with `waitForTransactionReceipt`, retrying up to 5 times (5, 10, 15, 20 and 25 s apart) when
   [isRetryableReceiptError](/packages/pulsar-evm/functions/isRetryableReceiptError.md) matches. If viem reports a replacement, calls `onReplaced` and stops.
4. If `requiredConfirmations` is above 1, polls `getTransactionConfirmations` every 5 s until it is reached.
5. Awaits `onSuccess`, also for reverted transactions.

Any other error, including one thrown by `onSuccess`, is passed to `onFailure`.

## Parameters

### params

[`EVMTrackerParams`](/packages/pulsar-evm/type-aliases/EVMTrackerParams.md)

The transaction, the wagmi config and the callbacks.

## Returns

`Promise`\<`void`\>

A promise that resolves when tracking has finished.

## Example

```ts
await evmTracker({
  config: wagmiConfig,
  tx: { txKey: hash, chainId: 1, requiredConfirmations: 2 },
  onTxDetailsFetched: (details) => console.log('Nonce', details.nonce),
  onSuccess: async (_details, receipt) => console.log('Mined with status', receipt.status),
  onReplaced: (replacement) => console.log('Replaced by', replacement.transaction.hash),
  onFailure: (error) => console.error('Tracking failed', error),
});
```
