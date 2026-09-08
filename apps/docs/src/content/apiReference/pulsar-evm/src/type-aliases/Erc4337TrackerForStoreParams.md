[**API Reference.**](../../../README.md)

***

# Erc4337TrackerForStoreParams\<T\>

> **Erc4337TrackerForStoreParams**\<`T`\> = `Pick`\<`ITxTrackingStore`\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\> & `object` & `TrackerCallbacks`\<`T`\>

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:165](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L165)

Parameters for the store-connected ERC-4337 tracker.

## Type Declaration

### config?

> `optional` **config?**: `Config`

### tx

> **tx**: `T`

## Type Parameters

### T

`T` *extends* `Transaction`
