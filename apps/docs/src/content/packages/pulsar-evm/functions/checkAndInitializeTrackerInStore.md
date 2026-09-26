# checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [utils/checkAndInitializeTrackerInStore.ts:43](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/checkAndInitializeTrackerInStore.ts#L43)

Starts the tracker named by `tracker` for a transaction of the Pulsar store: [evmTrackerForStore](/packages/pulsar-evm/functions/evmTrackerForStore.md),
[erc4337TrackerForStore](/packages/pulsar-evm/functions/erc4337TrackerForStore.md), [safeTrackerForStore](/packages/pulsar-evm/functions/safeTrackerForStore.md) or [gelatoTrackerForStore](/packages/pulsar-evm/functions/gelatoTrackerForStore.md). A Gelato transaction
without `gelatoApiKey`, or an unknown tracker, falls back to the standard EVM tracker with a console warning.
`pulsarEvmAdapter` uses it as `checkAndInitializeTrackerInStore`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

[`InitializeTrackerParams`](/packages/pulsar-evm/type-aliases/InitializeTrackerParams.md)\<`T`\>

The tracker, the transaction, the wagmi config, the store members and the callbacks.

## Returns

`Promise`\<`void`\>

The promise of the started tracker. For the standard EVM tracker it resolves only when tracking has
finished; polling trackers resolve once polling has started.
