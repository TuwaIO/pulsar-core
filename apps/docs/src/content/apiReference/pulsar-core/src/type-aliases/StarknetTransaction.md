[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StarknetTransaction

> **StarknetTransaction** = [`BaseTransaction`](BaseTransaction.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:160](https://github.com/TuwaIO/pulsar-core/blob/bfc0aae5e0464a9da46a97e56a60b533c56f1df2/packages/pulsar-core/src/types.ts#L160)

Represents a Starknet-specific transaction, extending the base properties.

## Type Declaration

### actualFee?

> `optional` **actualFee?**: `object`

The actual fee paid for the transaction.

#### actualFee.amount

> **amount**: `string`

#### actualFee.unit

> **unit**: `string`

### adapter

> **adapter**: `OrbitAdapter.Starknet`

The adapter type for Starknet transactions.

### contractAddress?

> `optional` **contractAddress?**: `string`

The address of the contract being interacted with.
