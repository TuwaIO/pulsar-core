[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionPool\<TR, T\>

> **TransactionPool**\<`TR`, `T`\> = `Record`\<`string`, `T`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:15](https://github.com/TuwaIO/pulsar-core/blob/98e433e0b5469717bae47a7476c9ed01c1e7d3df/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L15)

Defines the structure of the transaction pool, which is a record of transactions indexed by their unique keys.

## Type Parameters

### TR

`TR`

The type of the tracker identifier.

### T

`T` *extends* [`Transaction`](Transaction.md)\<`TR`\>

The transaction type.
