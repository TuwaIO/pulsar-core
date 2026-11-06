# SyncCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:378](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L378)

Callbacks that synchronize the local pool with a remote backend (for example Quasar). Passed to
`createPulsarStore`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Properties

### onRemoteCreate?

> `optional` **onRemoteCreate?**: (`tx`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:387](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L387)

Called in the background with every new transaction, right after `addTxToPool` has written it to the pool with
`syncStatus: 'pending-sync'` and listed its key in `unsyncedTxKeys`. It never delays or blocks tracking. Resolving
marks the transaction `'synced'` and removes the key; rejecting logs a warning and leaves the key for
`reconcileUnsyncedTransactions`, also across reloads. Reject (throw) on failure: a resolved promise counts as
synced. A transaction is never sent twice at the same time.

#### Parameters

##### tx

`T`

A copy of the pooled transaction without `pimlicoApiKey` and `rpcUrl`.

#### Returns

`Promise`\<`void`\>
