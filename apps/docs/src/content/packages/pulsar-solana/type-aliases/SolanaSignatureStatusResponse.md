# SolanaSignatureStatusResponse

> **SolanaSignatureStatusResponse** = `object`

Defined in: [trackers/solanaTracker.ts:29](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L29)

The status of a Solana transaction that [solanaFetcher](/packages/pulsar-solana/functions/solanaFetcher.md) reports: the signature status combined with details
from `getTransaction`. The details (`fee`, `recentBlockhash`, `instructions`) are missing until `getTransaction`
returns them, and in a success reported without them.

## Properties

### confirmations

> **confirmations**: `number` \| `null`

Defined in: [trackers/solanaTracker.ts:33](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L33)

The number of confirmations (0 once the transaction is rooted).

***

### confirmationStatus

> **confirmationStatus**: `"processed"` \| `"confirmed"` \| `"finalized"` \| `null`

Defined in: [trackers/solanaTracker.ts:37](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L37)

The commitment level the transaction has reached.

***

### err

> **err**: `TransactionError` \| `null`

Defined in: [trackers/solanaTracker.ts:35](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L35)

The on-chain error of a failed transaction, or `null`.

***

### expired?

> `optional` **expired?**: `boolean`

Defined in: [trackers/solanaTracker.ts:48](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L48)

`true` when the signature is still unknown and the chain has passed the `lastValidBlockHeight` of the transaction:
its blockhash expired and it can no longer land.

***

### fee?

> `optional` **fee?**: `number`

Defined in: [trackers/solanaTracker.ts:39](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L39)

The transaction fee, in lamports.

***

### instructions?

> `optional` **instructions?**: `unknown`[]

Defined in: [trackers/solanaTracker.ts:43](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L43)

The instructions of the transaction.

***

### recentBlockhash?

> `optional` **recentBlockhash?**: `string`

Defined in: [trackers/solanaTracker.ts:41](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L41)

The blockhash the transaction was signed with.

***

### slot

> **slot**: `number`

Defined in: [trackers/solanaTracker.ts:31](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L31)

The slot in which the transaction was processed.
