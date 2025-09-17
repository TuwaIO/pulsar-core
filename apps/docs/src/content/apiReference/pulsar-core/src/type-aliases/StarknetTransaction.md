[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StarknetTransaction\<T\>

> **StarknetTransaction**\<`T`\> = [`BaseTransaction`](BaseTransaction.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:159](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-core/src/types.ts#L159)

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

### revertReason?

> `optional` **revertReason**: `string`

The reason for transaction failure, if applicable.

## Type Parameters

### T

`T`

The type of the tracker identifier.
