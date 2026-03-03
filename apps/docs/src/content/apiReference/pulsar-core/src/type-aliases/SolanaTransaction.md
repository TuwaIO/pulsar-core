[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaTransaction

> **SolanaTransaction** = [`BaseTransaction`](BaseTransaction.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:138](https://github.com/TuwaIO/pulsar-core/blob/d0c4882888327c2e3f6b0b4137e2a4cb2f61a986/packages/pulsar-core/src/types.ts#L138)

Represents a Solana-specific transaction, extending the base properties.

## Type Declaration

### adapter

> **adapter**: `OrbitAdapter.SOLANA`

The adapter type for Solana transactions.

### confirmations?

> `optional` **confirmations**: `number` \| `string` \| `null`

The number of confirmations received. A string value indicates a confirmed transaction, while `null` means it's pending.

### fee?

> `optional` **fee**: `number`

The transaction fee in lamports.

### instructions?

> `optional` **instructions**: `unknown`[]

The instructions included in the transaction.

### recentBlockhash?

> `optional` **recentBlockhash**: `string`

The recent blockhash used for the transaction.

### rpcUrl?

> `optional` **rpcUrl**: `string`

The RPC URL used to submit and track this transaction.

### slot?

> `optional` **slot**: `number`

The slot in which the transaction was processed.
