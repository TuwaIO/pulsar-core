[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StarknetTransaction\<T\>

> **StarknetTransaction**\<`T`\> = [`BaseTransaction`](BaseTransaction.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:159](https://github.com/TuwaIO/pulsar-core/blob/6e853cdf24205aa65c8aaa854fb54ff9fbe3d2ad/packages/pulsar-core/src/types.ts#L159)

Represents a Starknet-specific transaction, extending the base properties.

## Type Declaration

### actualFee?

> `optional` **actualFee**: `object`

The actual fee paid for the transaction.

#### actualFee.amount

> **amount**: `string`

#### actualFee.unit

> **unit**: `string`

### adapter

> **adapter**: [`Starknet`](../enumerations/TransactionAdapter.md#starknet)

### contractAddress?

> `optional` **contractAddress**: `string`

The address of the contract being interacted with.

## Type Parameters

### T

`T`

The type of the tracker identifier.
