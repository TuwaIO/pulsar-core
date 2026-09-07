[**API Reference.**](../../../README.md)

***

# Erc4337FetchResult

> **Erc4337FetchResult** = `object`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:34](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L34)

Result structure produced by `erc4337Fetcher` on each polling cycle.

## Properties

### hash?

> `optional` **hash?**: `Hex`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:37](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L37)

***

### reason?

> `optional` **reason?**: `string`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:38](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L38)

***

### receipt

> **receipt**: [`Erc4337UserOpReceipt`](Erc4337UserOpReceipt.md) \| `null`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:35](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L35)

***

### status

> **status**: `"pending"` \| `"success"` \| `"failed"`

Defined in: [packages/pulsar-evm/src/trackers/erc4337Tracker.ts:36](https://github.com/TuwaIO/pulsar-core/blob/51498c2594c27f405fc78282593fff48a93004ea/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L36)
