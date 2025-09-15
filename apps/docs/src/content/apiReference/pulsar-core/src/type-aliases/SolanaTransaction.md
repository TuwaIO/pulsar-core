[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaTransaction\<T\>

> **SolanaTransaction**\<`T`\> = [`BaseTransaction`](BaseTransaction.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:125](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L125)

Represents a Solana-specific transaction, extending the base properties.

## Type Declaration

### adapter

> **adapter**: [`SOLANA`](../enumerations/TransactionAdapter.md#solana)

### confirmations?

> `optional` **confirmations**: `number` \| `null`

The number of confirmations the transaction has received, or null if the transaction is still pending.

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

The RPC URL used for the transaction.

### slot?

> `optional` **slot**: `number`

The slot in which the transaction was processed.

## Type Parameters

### T

`T`

The type of the tracker identifier.
