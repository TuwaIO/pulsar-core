# Erc4337FetchResult

> **Erc4337FetchResult** = `object`

Defined in: [trackers/erc4337Tracker.ts:33](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L33)

The result [erc4337Fetcher](/packages/pulsar-evm/functions/erc4337Fetcher.md) reports on each polling tick.

## Properties

### hash?

> `optional` **hash?**: `Hex`

Defined in: [trackers/erc4337Tracker.ts:39](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L39)

The hash of the bundle transaction that included the UserOperation, once known.

***

### reason?

> `optional` **reason?**: `string`

Defined in: [trackers/erc4337Tracker.ts:41](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L41)

The failure reason: the revert reason of the receipt, or a validation message.

***

### receipt

> **receipt**: [`Erc4337UserOpReceipt`](/packages/pulsar-evm/type-aliases/Erc4337UserOpReceipt.md) \| `null`

Defined in: [trackers/erc4337Tracker.ts:35](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L35)

The UserOperation receipt, or `null` while it is not available.

***

### status

> **status**: `"pending"` \| `"success"` \| `"failed"`

Defined in: [trackers/erc4337Tracker.ts:37](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L37)

`pending` while the UserOperation is not bundled, then `success` or `failed`.
