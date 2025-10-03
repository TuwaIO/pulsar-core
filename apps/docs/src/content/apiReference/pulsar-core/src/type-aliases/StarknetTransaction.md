[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StarknetTransaction

> **StarknetTransaction** = [`BaseTransaction`](BaseTransaction.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:156](https://github.com/TuwaIO/pulsar-core/blob/fa53be494bf60c2dfc7d93a5ee62023074055721/packages/pulsar-core/src/types.ts#L156)

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

> **adapter**: `OrbitAdapter.Starknet`

The adapter type for Starknet transactions.

### contractAddress?

> `optional` **contractAddress**: `string`

The address of the contract being interacted with.
