[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmTracker()

> **evmTracker**(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:45](https://github.com/TuwaIO/pulsar-core/blob/f0f5d6f91c3be58651d790d4784e75c2d93f0376/packages/pulsar-evm/src/trackers/evmTracker.ts#L45)

A low-level tracker for monitoring a standard EVM transaction by its hash.
It retries fetching the transaction and then waits for its receipt to determine the final status.

## Parameters

### params

[`EVMTrackerParams`](../type-aliases/EVMTrackerParams.md)

The configuration object for the tracker.

## Returns

`Promise`\<`void`\>
