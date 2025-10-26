[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmTracker()

> **evmTracker**(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:45](https://github.com/TuwaIO/pulsar-core/blob/4d9299d31f77cf552b25cba7d488eec29e0bafc2/packages/pulsar-evm/src/trackers/evmTracker.ts#L45)

A low-level tracker for monitoring a standard EVM transaction by its hash.
It retries fetching the transaction and then waits for its receipt to determine the final status.

## Parameters

### params

[`EVMTrackerParams`](../type-aliases/EVMTrackerParams.md)

The configuration object for the tracker.

## Returns

`Promise`\<`void`\>
