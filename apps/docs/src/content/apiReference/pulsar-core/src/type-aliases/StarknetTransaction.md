[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StarknetTransaction\<T\>

> **StarknetTransaction**\<`T`\> = [`BaseTransaction`](BaseTransaction.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:145](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/types.ts#L145)

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
