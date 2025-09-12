[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaTransaction\<T\>

> **SolanaTransaction**\<`T`\> = [`BaseTransaction`](BaseTransaction.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:127](https://github.com/TuwaIO/pulsar-core/blob/494f4105ae0c6206b7fb474bf50e2b00399fd8c0/packages/pulsar-core/src/types.ts#L127)

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
