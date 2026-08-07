[**API Reference.**](../../../README.md)

***

# SolanaTransaction

> **SolanaTransaction** = [`BaseTransaction`](BaseTransaction.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:153](https://github.com/TuwaIO/pulsar-core/blob/6a829cc584a4473ad994020ccbe6fa99848e8820/packages/pulsar-core/src/types.ts#L153)

Represents a Solana-specific transaction, extending the base properties.

## Type Declaration

### adapter

> **adapter**: `OrbitAdapter.SOLANA`

The adapter type for Solana transactions.

### fee?

> `optional` **fee?**: `number`

The transaction fee in lamports.

### instructions?

> `optional` **instructions?**: `unknown`[]

The instructions included in the transaction.

### recentBlockhash?

> `optional` **recentBlockhash?**: `string`

The recent blockhash used for the transaction.

### slot?

> `optional` **slot?**: `number`

The slot in which the transaction was processed.
