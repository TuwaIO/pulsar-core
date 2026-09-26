# checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [utils/checkAndInitializeTrackerInStore.ts:32](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/utils/checkAndInitializeTrackerInStore.ts#L32)

Starts [solanaTrackerForStore](/packages/pulsar-solana/functions/solanaTrackerForStore.md) when `tracker` is `TransactionTracker.Solana`. Any other tracker logs an error
and marks the transaction `Failed` (without calling `onError`). `pulsarSolanaAdapter` uses it as
`checkAndInitializeTrackerInStore`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

`object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\> & `Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\>

The tracker, the transaction, the store members and the callbacks.

## Returns

`Promise`\<`void`\>

A promise that resolves once polling has started.
