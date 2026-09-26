# isRetryableReceiptError()

> **isRetryableReceiptError**(`error`): `boolean`

Defined in: [trackers/evmTracker.ts:45](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L45)

Checks whether an error thrown while waiting for a receipt is transient: a receipt timeout or "not found" error, an
HTTP or WebSocket transport error, or a message about a timeout, rate limit, connection reset or a 502/503/504
status. Nested `cause` errors are checked too.

## Parameters

### error

`unknown`

The caught error.

## Returns

`boolean`

`true` if waiting for the receipt should be retried.
