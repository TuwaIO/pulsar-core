[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionPool\<T\>

> **TransactionPool**\<`T`\> = `Record`\<`string`, `T`\>

Defined in: [packages/pulsar-core/src/types.ts:331](https://github.com/TuwaIO/pulsar-core/blob/bc1c6d37605e7ee8f8408c4101eedb0acc877efc/packages/pulsar-core/src/types.ts#L331)

Defines the structure of the transaction pool, a key-value store of transactions indexed by their unique keys.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The type of the transaction object being tracked.
