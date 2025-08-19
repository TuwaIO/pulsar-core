[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaTransaction\<T\>

> **SolanaTransaction**\<`T`\> = [`BaseTransaction`](BaseTransaction.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:115](https://github.com/TuwaIO/pulsar-core/blob/3c7dfd4bb35a5c5bf0b6bdf4d64b37f2ab5357a0/packages/pulsar-core/src/types.ts#L115)

Represents a Solana-specific transaction, extending the base properties.

## Type declaration

### adapter

> **adapter**: [`SOLANA`](../enumerations/TransactionAdapter.md#solana)

The transaction adapter type.

### fee?

> `optional` **fee**: `number`

The transaction fee.

### instructions?

> `optional` **instructions**: `any`[]

The instructions included in the transaction.

### recentBlockhash?

> `optional` **recentBlockhash**: `string`

The recent blockhash used for the transaction.

### slot?

> `optional` **slot**: `number`

The slot in which the transaction was processed.

## Type Parameters

### T

`T`

The type of the tracker identifier.
