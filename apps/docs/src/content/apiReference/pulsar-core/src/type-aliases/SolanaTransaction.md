[**API Reference.**](../../../README.md)

***

# SolanaTransaction

> **SolanaTransaction** = [`BaseTransaction`](BaseTransaction.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:151](https://github.com/TuwaIO/pulsar-core/blob/c009e922cecf941d1fcdf2f75b06344c7f83e79e/packages/pulsar-core/src/types.ts#L151)

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
