[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionPool\<T\>

> **TransactionPool**\<`T`\> = `Record`\<`string`, `T`\>

Defined in: [packages/pulsar-core/src/types.ts:357](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L357)

Defines the structure of the transaction pool, a key-value store of transactions indexed by their unique keys.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The type of the transaction object being tracked.
