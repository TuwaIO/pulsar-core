# SolanaTransaction

> **SolanaTransaction** = [`BaseTransaction`](/packages/pulsar-core/type-aliases/BaseTransaction.md) & `object`

Defined in: [types.ts:200](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L200)

A Solana transaction. The Solana tracker fills the on-chain fields once the transaction is found.

## Type Declaration

### adapter

> **adapter**: `OrbitAdapter.SOLANA`

Always `OrbitAdapter.SOLANA`.

### fee?

> `optional` **fee?**: `number`

The transaction fee, in lamports.

### instructions?

> `optional` **instructions?**: `unknown`[]

The instructions of the transaction, as returned by the `getTransaction` RPC method.

### recentBlockhash?

> `optional` **recentBlockhash?**: `string`

The blockhash the transaction was signed with.

### slot?

> `optional` **slot?**: `number`

The slot in which the transaction was processed.
