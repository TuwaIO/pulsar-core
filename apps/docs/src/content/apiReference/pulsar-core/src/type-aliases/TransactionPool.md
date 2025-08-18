[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionPool\<TR, T\>

> **TransactionPool**\<`TR`, `T`\> = `Record`\<`string`, `T`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:15](https://github.com/TuwaIO/pulsar-core/blob/dbac4ff9fac5e788ddd51c1eb159f621106ceb73/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L15)

Defines the structure of the transaction pool, which is a record of transactions indexed by their unique keys.

## Type Parameters

### TR

`TR`

The type of the tracker identifier.

### T

`T` *extends* [`Transaction`](Transaction.md)\<`TR`\>

The transaction type.
