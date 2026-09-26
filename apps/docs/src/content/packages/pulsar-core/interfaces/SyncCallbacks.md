# SyncCallbacks\<T\>

Defined in: [types.ts:324](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L324)

Callbacks that synchronize the local pool with a remote backend (for example Quasar). Passed to
`createPulsarStore`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Properties

### onRemoteCreate?

> `optional` **onRemoteCreate?**: (`tx`) => `Promise`\<`void`\>

Defined in: [types.ts:333](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L333)

Called in the background with every new transaction, right after `addTxToPool` has written it to the pool with
`syncStatus: 'pending-sync'` and listed its key in `unsyncedTxKeys`. It never delays or blocks tracking. Resolving
marks the transaction `'synced'` and removes the key; rejecting logs a warning and leaves the key for
`reconcileUnsyncedTransactions`, also across reloads. Reject (throw) on failure: a resolved promise counts as
synced. A transaction is never sent twice at the same time.

#### Parameters

##### tx

`T`

A copy of the pooled transaction without `pimlicoApiKey` and `gelatoApiKey`.

#### Returns

`Promise`\<`void`\>
