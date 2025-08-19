[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StarknetTransaction\<T\>

> **StarknetTransaction**\<`T`\> = [`BaseTransaction`](BaseTransaction.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:132](https://github.com/TuwaIO/pulsar-core/blob/0ac47fbd71e3f16b6f165721254c65739d8470fd/packages/pulsar-core/src/types.ts#L132)

Represents a Starknet-specific transaction, extending the base properties.

## Type declaration

### actualFee?

> `optional` **actualFee**: `object`

The actual fee paid for the transaction.

#### actualFee.amount

> **amount**: `string`

#### actualFee.unit

> **unit**: `string`

### adapter

> **adapter**: [`Starknet`](../enumerations/TransactionAdapter.md#starknet)

The transaction adapter type.

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
