[**API Reference.**](../../../README.md)

***

# Erc4337FetchResult

> **Erc4337FetchResult** = `object`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:30](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L30)

Result structure produced by `erc4337Fetcher` on each polling cycle.

## Properties

### hash?

> `optional` **hash?**: `Hex`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:33](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L33)

***

### reason?

> `optional` **reason?**: `string`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:34](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L34)

***

### receipt

> **receipt**: [`Erc4337UserOpReceipt`](Erc4337UserOpReceipt.md) \| `null`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:31](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L31)

***

### status

> **status**: `"pending"` \| `"success"` \| `"failed"`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:32](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L32)
