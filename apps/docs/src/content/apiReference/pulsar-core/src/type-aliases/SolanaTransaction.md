[**API Reference.**](../../../README.md)

***

# SolanaTransaction

> **SolanaTransaction** = [`BaseTransaction`](BaseTransaction.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:151](https://github.com/TuwaIO/pulsar-core/blob/b07dd22051bc55774d8350cd6e66a57ea987b080/packages/pulsar-core/src/types.ts#L151)

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
