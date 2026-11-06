# ~~isRetryableReceiptError()~~

> **isRetryableReceiptError**(`error`): `boolean`

Defined in: [trackers/evmTracker.ts:60](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L60)

Tells whether an error thrown while waiting for a receipt is transient: a receipt timeout or "not found" error, an HTTP
or WebSocket transport error, or a message about a timeout, rate limit, connection reset or a 502/503/504 status. Nested
`cause` errors are checked too.

## Parameters

### error

`unknown`

The caught error.

## Returns

`boolean`

`true` if the error looks transient.

## Deprecated

`evmTracker` no longer uses it: any error while waiting means no answer yet. It will be removed.
