# evmTracker()

> **evmTracker**(`params`): `Promise`\<`void`\>

Defined in: [trackers/evmTracker.ts:229](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L229)

Tracks a standard EVM transaction by its hash, without a store. Use it to track transactions in your own state or on
a server.

Steps (all RPC calls go through the wagmi client of `tx.chainId`):
1. Calls `onInitialize`. Fails at once for the zero hash or when there is no client for the chain.
2. Calls `getTransaction` up to `retryCount` times, `retryTimeout` ms apart, so a transaction the node has not
   indexed yet is still found; then calls `onTxDetailsFetched`. With `knownDetails` a hash the node does not show is
   no failure: the nonce decides. A hash the node does not show is also asked of the wallet connected on the chain
   (`config.state.connections`), through its provider and with no prompt, as only its RPC may hold it: without the nonce no
   speed-up of it can be seen.
3. Waits for the receipt with `waitForTransactionReceipt`, for as long as `receiptAttempts` says. If viem reports a replacement,
   calls `onReplaced` and stops. After every attempt that ended without an answer, whatever the error, it reads the
   sender's nonce with [readNonceSlot](/packages/pulsar-evm/functions/readNonceSlot.md) and reports a replacement it finds.
4. If `requiredConfirmations` is above 1, polls `getTransactionConfirmations` every 5 s until it is reached, reading the
   receipt again each time, so one a reorganization dropped goes back to waiting. `confirmationsTimeout` limits this wait.
5. Awaits `onSuccess`, also for reverted transactions.

Reading the nonce between attempts is what makes a replacement visible at all: viem remembers the transaction only
inside one call, a new call must fetch it by hash, and a node stops returning the hash once the replacement reaches
its mempool. viem then skips the block scan for good, and a block mined between two calls is never read. Do not go
back to one long call either: a slow transaction would fail when it ends.

An error thrown by `onSuccess` is passed to `onFailure`.

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
