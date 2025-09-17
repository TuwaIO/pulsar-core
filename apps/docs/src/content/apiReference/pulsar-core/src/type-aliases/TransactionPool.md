[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionPool\<TR, T\>

> **TransactionPool**\<`TR`, `T`\> = `Record`\<`string`, `T`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:15](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L15)

Defines the structure of the transaction pool, a key-value store of transactions indexed by their unique keys.

## Type Parameters

### TR

`TR`

The type of the tracker identifier.

### T

`T` *extends* [`Transaction`](Transaction.md)\<`TR`\>

The transaction type.
