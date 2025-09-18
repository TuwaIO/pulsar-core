[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionPool\<T\>

> **TransactionPool**\<`T`\> = `Record`\<`string`, `T`\>

Defined in: [packages/pulsar-core/src/store/initializeTxTrackingStore.ts:14](https://github.com/TuwaIO/pulsar-core/blob/227594b111c3b7431fc1b2bfe3380cc9ee0fa156/packages/pulsar-core/src/store/initializeTxTrackingStore.ts#L14)

Defines the structure of the transaction pool, a key-value store of transactions indexed by their unique keys.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The type of the transaction object being tracked.
