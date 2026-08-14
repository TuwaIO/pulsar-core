[**API Reference.**](../../../README.md)

***

# StarknetTransaction

> **StarknetTransaction** = [`BaseTransaction`](BaseTransaction.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:169](https://github.com/TuwaIO/pulsar-core/blob/04262b00f797406a8a57df5eb1e0a1258d30caf9/packages/pulsar-core/src/types.ts#L169)

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
