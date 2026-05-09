[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaTransaction

> **SolanaTransaction** = [`BaseTransaction`](BaseTransaction.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:144](https://github.com/TuwaIO/pulsar-core/blob/bfc0aae5e0464a9da46a97e56a60b533c56f1df2/packages/pulsar-core/src/types.ts#L144)

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
