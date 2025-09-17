[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaTransaction\<T\>

> **SolanaTransaction**\<`T`\> = [`BaseTransaction`](BaseTransaction.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:139](https://github.com/TuwaIO/pulsar-core/blob/e4e6c80b06717a36e79850d69c03d964005053f1/packages/pulsar-core/src/types.ts#L139)

Represents a Solana-specific transaction, extending the base properties.

## Type Declaration

### adapter

> **adapter**: [`SOLANA`](../enumerations/TransactionAdapter.md#solana)

### confirmations?

> `optional` **confirmations**: `number` \| `null`

The number of confirmations received. `null` if the transaction is pending or unconfirmed.

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

## Type Parameters

### T

`T`

The type of the tracker identifier.
