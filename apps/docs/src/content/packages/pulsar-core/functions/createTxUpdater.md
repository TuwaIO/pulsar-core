# createTxUpdater()

> **createTxUpdater**\<`T`\>(`params`): (`fields`) => `T` \| `undefined`

Defined in: [utils/createTxUpdater.ts:31](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/createTxUpdater.ts#L31)

Creates an updater for a store-connected tracker: it writes fields to the store with `updateTxParams` and returns the
tracked transaction with every update applied so far.

The `transactionsPool` a tracker receives is a snapshot taken when tracking starts, and Immer replaces the pool on
every update, so reading the snapshot after `updateTxParams` returns stale data. Pass the object returned here to
`TrackerCallbacks` instead. The built-in trackers of `@tuwaio/pulsar-evm` and `@tuwaio/pulsar-solana` use it; use it
in custom trackers too.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### params

`Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"transactionsPool"`\> & `object`

The tracked transaction and the store members used by trackers.

## Returns

A function that calls `updateTxParams(tx.txKey, fields)` and returns the updated transaction, or `undefined`
when the transaction was not in the pool when tracking started. The snapshot is not mutated.

(`fields`) => `T` \| `undefined`

## Example

```ts
const updateTx = createTxUpdater({ tx, transactionsPool, updateTxParams });
const updatedTx = updateTx({ status: TransactionStatus.Success, pending: false });
if (updatedTx) onSuccess?.(updatedTx);
```
