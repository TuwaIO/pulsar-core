# eip5792Tracker()

> **eip5792Tracker**\<`T`\>(`params`): `void`

Defined in: [trackers/eip5792Tracker.ts:145](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/eip5792Tracker.ts#L145)

Starts polling an EIP-5792 call batch in the background without a store: the wallet's status every 2 s by default,
giving up after 60 consecutive failed attempts. It does not wait for block confirmations of the executing transaction
(pass `onSuccess`'s `hash` to [evmTracker](/packages/pulsar-evm/functions/evmTracker.md) for that).

## Type Parameters

### T

`T` *extends* [`Eip5792FetcherTx`](/packages/pulsar-evm/type-aliases/Eip5792FetcherTx.md) & `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"pending"`\>

The tracked transaction type.

## Parameters

### params

[`Eip5792TrackerConfig`](/packages/pulsar-evm/type-aliases/Eip5792TrackerConfig.md)\<`T`\>

The batch, the wagmi config and the callbacks.

## Returns

`void`

The promise of `initializePollingTracker`, which resolves once polling has started.

## Example

```ts
const { id } = await sendCalls(wagmiConfig, { calls });
eip5792Tracker({
  tx: { txKey: id, pending: true },
  config: wagmiConfig,
  onSuccess: ({ hash }) => console.log('Executed in', hash),
  onFailure: (result) => console.error('Batch failed', result?.reason),
});
```
