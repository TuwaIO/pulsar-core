[**API Reference.**](../../../README.md)

***

# Erc4337FetchResult

> **Erc4337FetchResult** = `object`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:34](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L34)

Result structure produced by `erc4337Fetcher` on each polling cycle.

## Properties

### hash?

> `optional` **hash?**: `Hex`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:37](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L37)

***

### reason?

> `optional` **reason?**: `string`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:38](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L38)

***

### receipt

> **receipt**: [`Erc4337UserOpReceipt`](Erc4337UserOpReceipt.md) \| `null`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:35](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L35)

***

### status

> **status**: `"pending"` \| `"success"` \| `"failed"`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:36](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L36)
