[**API Reference.**](../../../README.md)

***

# erc4337TrackerForStore()

> **erc4337TrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:187](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L187)

High-level two-stage tracker for ERC-4337 UserOperations integrated with the Pulsar store.

- Stage 1 (Bundler Mempool): Polls `eth_getUserOperationReceipt` against the Bundler RPC.
  As soon as the UserOp is bundled on-chain, writes `tx.hash` to the store and stops Bundler polling
  without evicting the transaction from the pool.
- Stage 2 (EVM On-Chain Finality): Hands off tracking to `evmTracker` for on-chain block confirmations,
  block timestamp resolution, and final terminal status update.

Supports seamless session restoration across page reloads: if `tx.hash` is already populated,
Stage 1 is bypassed and tracking resumes directly at Stage 2.

## Type Parameters

### T

`T` *extends* `Transaction`

## Parameters

### params

[`Erc4337TrackerForStoreParams`](../type-aliases/Erc4337TrackerForStoreParams.md)\<`T`\>

The store actions, Wagmi config, and transaction object to track.

## Returns

`Promise`\<`void`\>
