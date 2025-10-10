[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmTracker()

> **evmTracker**(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:46](https://github.com/TuwaIO/pulsar-core/blob/e265bfd0fe7b6df6af7f5f22f2db23a0f14dd130/packages/pulsar-evm/src/trackers/evmTracker.ts#L46)

A low-level tracker for monitoring a standard EVM transaction by its hash.
It retries fetching the transaction and then waits for its receipt to determine the final status.

## Parameters

### params

[`EVMTrackerParams`](../type-aliases/EVMTrackerParams.md)

The configuration object for the tracker.

## Returns

`Promise`\<`void`\>
