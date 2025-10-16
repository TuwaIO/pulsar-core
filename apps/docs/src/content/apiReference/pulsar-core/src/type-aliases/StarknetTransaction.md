[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StarknetTransaction

> **StarknetTransaction** = [`BaseTransaction`](BaseTransaction.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:167](https://github.com/TuwaIO/pulsar-core/blob/e8765c9c53b3d4580e23a5f3c1c11c08696663ba/packages/pulsar-core/src/types.ts#L167)

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
