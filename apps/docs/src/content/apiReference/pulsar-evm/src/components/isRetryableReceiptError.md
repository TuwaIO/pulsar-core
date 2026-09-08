[**API Reference.**](../../../README.md)

***

# isRetryableReceiptError()

> **isRetryableReceiptError**(`error`): `boolean`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:39](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-evm/src/trackers/evmTracker.ts#L39)

Checks whether an error during receipt polling is transient (RPC network glitch, timeout, or unindexed tx).
Recursively inspects nested error causes to handle wrapped Viem transport errors.

## Parameters

### error

`unknown`

The caught error object.

## Returns

`boolean`

`true` if the error is considered transient and retryable; otherwise `false`.
