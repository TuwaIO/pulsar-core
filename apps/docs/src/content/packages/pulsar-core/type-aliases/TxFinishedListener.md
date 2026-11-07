# TxFinishedListener\<T\>

> **TxFinishedListener**\<`T`\> = (`tx`) => `Promise`\<`void`\> \| `void`

Defined in: [packages/pulsar-core/src/types.ts:365](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L365)

A listener of the "transaction finished" event: `onTxFinished` of `createPulsarStore` and `subscribeTxFinished` of
the store.

It is called per open tab, when the transaction moves from a non-final status to `Success`, `Failed` or `Replaced`, and
again if the chain corrects a `Failed`, so a listener with side effects should key on `txKey` and `status`. Whatever finished
it counts: the tracker started by `executeTxAction`, a tracker restarted after a page reload
by `initializeTransactionsPool`, or a remote backend through `injectExternalPendingTxs`. Transactions that are
already final when the store restores them from storage do not call it. It runs synchronously while the store
writes the final status, before the `TrackerCallbacks` of the transaction. Its return value is not awaited; an error
it throws or a promise it rejects is logged and does not stop the other listeners.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### tx

`T`

The transaction with its final `status`.

## Returns

`Promise`\<`void`\> \| `void`
