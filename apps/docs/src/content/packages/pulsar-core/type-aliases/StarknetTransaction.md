# StarknetTransaction

> **StarknetTransaction** = [`BaseTransaction`](/packages/pulsar-core/type-aliases/BaseTransaction.md) & `object`

Defined in: [types.ts:214](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L214)

A Starknet transaction. Reserved for a Starknet adapter; Pulsar does not ship one.

## Type Declaration

### actualFee?

> `optional` **actualFee?**: `object`

The actual fee paid for the transaction.

#### actualFee.amount

> **amount**: `string`

The fee amount.

#### actualFee.unit

> **unit**: `string`

The fee unit.

### adapter

> **adapter**: `OrbitAdapter.Starknet`

Always `OrbitAdapter.Starknet`.

### contractAddress?

> `optional` **contractAddress?**: `string`

The address of the contract being interacted with.
