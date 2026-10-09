# Eip5792FetchResult

> **Eip5792FetchResult** = `object`

Defined in: [trackers/eip5792Tracker.ts:33](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L33)

The result [createEip5792Fetcher](/packages/pulsar-evm/functions/createEip5792Fetcher.md)'s fetcher reports on each polling tick.

## Properties

### hash?

> `optional` **hash?**: `Hex`

Defined in: [trackers/eip5792Tracker.ts:39](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L39)

The hash of the transaction that executed the batch (its last receipt), once known.

***

### reason?

> `optional` **reason?**: `string`

Defined in: [trackers/eip5792Tracker.ts:41](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L41)

The failure reason.

***

### status

> **status**: `"pending"` \| `"success"` \| `"failed"`

Defined in: [trackers/eip5792Tracker.ts:35](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L35)

`pending` while the wallet has not executed the batch, then `success` or `failed`.

***

### statusCode?

> `optional` **statusCode?**: `number`

Defined in: [trackers/eip5792Tracker.ts:37](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L37)

The EIP-5792 status code the wallet reported (100 pending, 200 confirmed, 400, 500, 600 failures).
