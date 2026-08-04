[**API Reference.**](../../../README.md)

***

# TransactionPool\<T\>

> **TransactionPool**\<`T`\> = `Record`\<`string`, `T`\>

Defined in: [packages/pulsar-core/src/types.ts:360](https://github.com/TuwaIO/pulsar-core/blob/4b3041607464e8599b86f8d9452bc13711d9f645/packages/pulsar-core/src/types.ts#L360)

Defines the structure of the transaction pool, a key-value store of transactions indexed by their unique keys.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The type of the transaction object being tracked.
