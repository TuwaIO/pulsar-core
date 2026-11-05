# Erc4337FetchResult

> **Erc4337FetchResult** = `object`

Defined in: [trackers/erc4337Tracker.ts:34](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L34)

The result [erc4337Fetcher](/packages/pulsar-evm/functions/erc4337Fetcher.md) reports on each polling tick.

## Properties

### hash?

> `optional` **hash?**: `Hex`

Defined in: [trackers/erc4337Tracker.ts:40](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L40)

The hash of the bundle transaction that included the UserOperation, once known.

***

### reason?

> `optional` **reason?**: `string`

Defined in: [trackers/erc4337Tracker.ts:42](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L42)

The failure reason: the revert reason of the receipt, or a validation message.

***

### receipt

> **receipt**: [`Erc4337UserOpReceipt`](/packages/pulsar-evm/type-aliases/Erc4337UserOpReceipt.md) \| `null`

Defined in: [trackers/erc4337Tracker.ts:36](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L36)

The UserOperation receipt, or `null` while it is not available.

***

### status

> **status**: `"pending"` \| `"success"` \| `"failed"`

Defined in: [trackers/erc4337Tracker.ts:38](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L38)

`pending` while the UserOperation is not bundled, then `success` or `failed`.
