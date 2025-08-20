[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmTracker()

> **evmTracker**(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:57](https://github.com/TuwaIO/pulsar-core/blob/3276bf16709f6ec29953e98e8eed75f9c97b41d2/packages/pulsar-evm/src/trackers/evmTracker.ts#L57)

A low-level tracker for monitoring a standard EVM transaction by its hash.
It retries fetching the transaction and then waits for its receipt.

## Parameters

### params

[`EVMTrackerParams`](../type-aliases/EVMTrackerParams.md)

The configuration object for the tracker.

## Returns

`Promise`\<`void`\>

A promise that resolves when the tracking process is complete (or has terminally failed).
