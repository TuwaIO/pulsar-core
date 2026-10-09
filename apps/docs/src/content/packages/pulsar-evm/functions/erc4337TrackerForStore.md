# erc4337TrackerForStore()

> **erc4337TrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [trackers/erc4337Tracker.ts:247](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L247)

Tracks an ERC-4337 UserOperation of the Pulsar store in two stages and writes the results to the store:

1. Bundler: polls [erc4337Fetcher](/packages/pulsar-evm/functions/erc4337Fetcher.md) every 2 s (up to 60 consecutive failed attempts). When the UserOperation
   is bundled, writes the bundle transaction `hash`. A reverted UserOperation, or 60 failed attempts, marks the
   transaction `Failed`.
2. On-chain: runs [evmTracker](/packages/pulsar-evm/functions/evmTracker.md) for the bundle transaction and writes the details, confirmations and the final
   `Success`, `Failed` or `Replaced` status. Without `config`, the transaction is marked `Success` as soon as it is
   bundled.

If `tx.hash` is already set (tracking resumed after a reload), stage 1 is skipped. The transaction is never removed
from the pool. The callbacks receive the transaction with every update written by the tracker.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

[`Erc4337TrackerForStoreParams`](/packages/pulsar-evm/type-aliases/Erc4337TrackerForStoreParams.md)\<`T`\>

The transaction, the wagmi config, the store members and the callbacks.

## Returns

`Promise`\<`void`\>

A promise that resolves once stage 1 has started, or when stage 2 has finished if it started directly.
