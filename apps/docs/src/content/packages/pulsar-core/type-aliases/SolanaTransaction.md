# SolanaTransaction

> **SolanaTransaction** = [`BaseTransaction`](/packages/pulsar-core/type-aliases/BaseTransaction.md) & `object`

Defined in: [types.ts:205](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L205)

A Solana transaction. The Solana tracker fills the on-chain fields once the transaction is found.

## Type Declaration

### adapter

> **adapter**: `OrbitAdapter.SOLANA`

Always `OrbitAdapter.SOLANA`.

### confirmationStatus?

> `optional` **confirmationStatus?**: `"processed"` \| `"confirmed"` \| `"finalized"`

The commitment the transaction has reached, updated by the Solana tracker while it is pending: `processed`,
`confirmed` (voted on by a supermajority, usually within a second; UIs can show the transaction as confirmed), then
`finalized`, when the tracker marks it `Success`.

### fee?

> `optional` **fee?**: `number`

The transaction fee, in lamports.

### instructions?

> `optional` **instructions?**: `unknown`[]

The instructions of the transaction, as returned by the `getTransaction` RPC method.

### lastValidBlockHeight?

> `optional` **lastValidBlockHeight?**: `number`

The last block height at which the blockhash of the transaction is valid. When the chain passes it and the
signature is still unknown, the transaction can no longer land and the Solana tracker marks it `Failed`. Saved
automatically for transactions sent with `signAndSendSolanaTx` of `@tuwaio/pulsar-solana`; for transactions sent
otherwise, set it with `updateTxParams`. Without it, an unknown signature fails one hour after `localTimestamp`.

### recentBlockhash?

> `optional` **recentBlockhash?**: `string`

The blockhash the transaction was signed with.

### slot?

> `optional` **slot?**: `number`

The slot in which the transaction was processed.
