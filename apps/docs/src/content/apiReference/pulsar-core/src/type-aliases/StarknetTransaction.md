[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StarknetTransaction

> **StarknetTransaction** = [`BaseTransaction`](BaseTransaction.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:192](https://github.com/TuwaIO/pulsar-core/blob/581af0fd8f6d32e377a9308802bc37dd710e7877/packages/pulsar-core/src/types.ts#L192)

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

The adapter type for Starknet transactions.

### contractAddress?

> `optional` **contractAddress**: `string`

The address of the contract being interacted with.
