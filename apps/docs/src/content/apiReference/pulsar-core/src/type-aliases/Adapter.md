[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# Adapter\<T\>

> **Adapter**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:264](https://github.com/TuwaIO/pulsar-core/blob/581af0fd8f6d32e377a9308802bc37dd710e7877/packages/pulsar-core/src/types.ts#L264)

The configuration object containing one or more transaction adapters.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type.

## Properties

### adapter

> **adapter**: [`TxAdapter`](TxAdapter.md)\<`T`\> \| [`TxAdapter`](TxAdapter.md)\<`T`\>[]

Defined in: [packages/pulsar-core/src/types.ts:266](https://github.com/TuwaIO/pulsar-core/blob/581af0fd8f6d32e377a9308802bc37dd710e7877/packages/pulsar-core/src/types.ts#L266)

A single `TxAdapter` instance or an array of them.
