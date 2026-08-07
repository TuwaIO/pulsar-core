[**API Reference.**](../../../README.md)

***

# TransactionPool\<T\>

> **TransactionPool**\<`T`\> = `Record`\<`string`, `T`\>

Defined in: [packages/pulsar-core/src/types.ts:360](https://github.com/TuwaIO/pulsar-core/blob/6a829cc584a4473ad994020ccbe6fa99848e8820/packages/pulsar-core/src/types.ts#L360)

Defines the structure of the transaction pool, a key-value store of transactions indexed by their unique keys.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The type of the transaction object being tracked.
