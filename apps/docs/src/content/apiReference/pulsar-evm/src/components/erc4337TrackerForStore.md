[**API Reference.**](../../../README.md)

***

# erc4337TrackerForStore()

> **erc4337TrackerForStore**\<`T`\>(`params`): `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:163](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L163)

High-level tracker that connects ERC-4337 UserOperation polling to the Zustand store.

## Type Parameters

### T

`T` *extends* `Transaction`

## Parameters

### params

`Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & `TrackerCallbacks`\<`T`\>

The store actions and transaction object to track.

## Returns

`void`
