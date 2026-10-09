# eip5792TrackerForStore()

> **eip5792TrackerForStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [trackers/eip5792Tracker.ts:189](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L189)

Tracks an EIP-5792 call batch of the Pulsar store in two stages and writes the results to the store:

1. Wallet: polls the batch status every 2 s (up to 60 consecutive failed attempts, e.g. while no wallet is
   connected). When the wallet has executed the batch, writes the transaction `hash`. A failed batch, or 60 failed
   attempts, marks the transaction `Failed`.
2. On-chain: follows the executing transaction with [evmTracker](/packages/pulsar-evm/functions/evmTracker.md) and writes the details, confirmations and the
   final `Success`, `Failed` or `Replaced` status.

If `tx.hash` is already set (tracking resumed after a reload), stage 1 is skipped. The transaction is never removed
from the pool. The callbacks receive the transaction with every update written by the tracker.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

[`Eip5792TrackerForStoreParams`](/packages/pulsar-evm/type-aliases/Eip5792TrackerForStoreParams.md)\<`T`\>

The transaction, the wagmi config, the store members and the callbacks.

## Returns

`Promise`\<`void`\>

A promise that resolves once stage 1 has started, or when stage 2 has finished if it started directly.
