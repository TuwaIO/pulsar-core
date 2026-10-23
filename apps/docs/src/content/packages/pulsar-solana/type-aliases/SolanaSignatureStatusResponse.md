# SolanaSignatureStatusResponse

> **SolanaSignatureStatusResponse** = `object`

Defined in: [trackers/solanaTracker.ts:28](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L28)

The status of a Solana transaction that [solanaFetcher](/packages/pulsar-solana/functions/solanaFetcher.md) reports: the signature status combined with details
from `getTransaction`. The details (`fee`, `recentBlockhash`, `instructions`) are missing until `getTransaction`
returns them, and in a success reported without them.

## Properties

### confirmations

> **confirmations**: `number` \| `null`

Defined in: [trackers/solanaTracker.ts:32](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L32)

The number of confirmations (0 once the transaction is rooted).

***

### confirmationStatus

> **confirmationStatus**: `"processed"` \| `"confirmed"` \| `"finalized"` \| `null`

Defined in: [trackers/solanaTracker.ts:36](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L36)

The commitment level the transaction has reached.

***

### err

> **err**: `TransactionError` \| `null`

Defined in: [trackers/solanaTracker.ts:34](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L34)

The on-chain error of a failed transaction, or `null`.

***

### expired?

> `optional` **expired?**: `boolean`

Defined in: [trackers/solanaTracker.ts:47](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L47)

`true` when the signature is still unknown and the chain has passed the `lastValidBlockHeight` of the transaction:
its blockhash expired and it can no longer land.

***

### fee?

> `optional` **fee?**: `number`

Defined in: [trackers/solanaTracker.ts:38](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L38)

The transaction fee, in lamports.

***

### instructions?

> `optional` **instructions?**: `unknown`[]

Defined in: [trackers/solanaTracker.ts:42](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L42)

The instructions of the transaction.

***

### recentBlockhash?

> `optional` **recentBlockhash?**: `string`

Defined in: [trackers/solanaTracker.ts:40](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L40)

The blockhash the transaction was signed with.

***

### slot

> **slot**: `number`

Defined in: [trackers/solanaTracker.ts:30](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L30)

The slot in which the transaction was processed.
