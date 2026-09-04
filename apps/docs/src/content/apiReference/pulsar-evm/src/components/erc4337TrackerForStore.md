[**API Reference.**](../../../README.md)

***

# erc4337TrackerForStore()

> **erc4337TrackerForStore**\<`T`\>(`params`): `void`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:127](https://github.com/TuwaIO/pulsar-core/blob/18e5da55b3b8542aa1cb462dd015c6097e4ec4f0/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L127)

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
