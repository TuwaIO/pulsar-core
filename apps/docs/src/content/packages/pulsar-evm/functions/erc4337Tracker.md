# erc4337Tracker()

> **erc4337Tracker**\<`T`\>(`config`): `void`

Defined in: [trackers/erc4337Tracker.ts:204](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L204)

Starts polling a UserOperation in the background with [erc4337Fetcher](/packages/pulsar-evm/functions/erc4337Fetcher.md), without a store: every 2 s by default,
giving up after 60 consecutive failed attempts. It only follows the bundler; it does not wait for block
confirmations of the bundle transaction (pass `onSuccess`'s `hash` to [evmTracker](/packages/pulsar-evm/functions/evmTracker.md) for that).

## Type Parameters

### T

`T` *extends* `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"chainId"` \| `"txKey"`\> & `Pick`\<[`EvmTransaction`](/packages/pulsar-core/type-aliases/EvmTransaction.md), `"bundlerUrl"` \| `"pimlicoApiKey"`\> & `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"pending"`\>

The tracked transaction type.

## Parameters

### config

[`Erc4337TrackerConfig`](/packages/pulsar-evm/type-aliases/Erc4337TrackerConfig.md)\<`T`\>

The UserOperation and the callbacks.

## Returns

`void`

## Example

```ts
erc4337Tracker({
  tx: { txKey: userOpHash, chainId: 11155111, pimlicoApiKey, pending: true },
  onSuccess: ({ hash }) => console.log('Bundled in', hash),
  onFailure: (result) => console.error('UserOperation failed', result?.reason),
});
```
