[**API Reference.**](../../../README.md)

***

# evmTracker()

> **evmTracker**(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:126](https://github.com/TuwaIO/pulsar-core/blob/4b3041607464e8599b86f8d9452bc13711d9f645/packages/pulsar-evm/src/trackers/evmTracker.ts#L126)

A low-level tracker for monitoring a standard EVM transaction by its hash.
Retries fetching transaction details and gracefully polls for transaction receipt,
recovering automatically from RPC network glitches and timeout errors.

## Parameters

### params

[`EVMTrackerParams`](../type-aliases/EVMTrackerParams.md)

The configuration parameters and lifecycle callbacks for the EVM tracker.

## Returns

`Promise`\<`void`\>

A promise that resolves when tracking completes or fails fatally.
