# BaseTransaction

> **BaseTransaction** = `object`

Defined in: [types.ts:62](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L62)

Fields shared by every tracked transaction. Chain-specific transaction types extend it.

## Properties

### chainId

> **chainId**: `number` \| `string`

Defined in: [types.ts:67](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L67)

The chain of the transaction: the numeric chain ID for EVM (for example `1`), or `solana:<cluster>` for Solana
(for example `solana:devnet`). `executeTxAction` derives it from `desiredChainID`.

***

### confirmations?

> `optional` **confirmations?**: `number` \| `string` \| `null`

Defined in: [types.ts:135](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L135)

Confirmations reported by the tracker while the transaction is pending. The Solana tracker sets it to `'MAX'` when
the transaction is finalized.

***

### connectorType

> **connectorType**: `string`

Defined in: [types.ts:125](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L125)

The connector that signed the transaction, for example `evm:metamask` or `solana:phantom`.

***

### description?

> `optional` **description?**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [types.ts:79](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L79)

User-facing description: one string for every state, or a tuple for the `[pending, success, error, replaced]`
states. Each string must be 300 characters or less and must not contain executable-like patterns such as `eval(`
or `javascript:`; `executeTxAction`, `addTxToPool` and the pool restore functions reject or drop transactions that
break these rules.

#### Example

```ts
description: 'Swap 1 ETH for 1,500 USDC';
description: ['Swapping...', 'Swapped successfully', 'Swap failed', 'Swap replaced'];
```

***

### error?

> `optional` **error?**: `TuwaErrorState`

Defined in: [types.ts:81](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L81)

The normalized error of a failed transaction (`normalizeError` from `@tuwaio/orbit-core`).

***

### finishedTimestamp?

> `optional` **finishedTimestamp?**: `number`

Defined in: [types.ts:86](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L86)

Unix timestamp (seconds) of the terminal state: the block timestamp for EVM and ERC-4337 transactions confirmed
on-chain, the execution date for Safe, and the local time otherwise.

***

### from

> **from**: `string`

Defined in: [types.ts:88](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L88)

The address of the wallet that sent the transaction, as reported by the adapter's `getConnectorInfo`.

***

### isError?

> `optional` **isError?**: `boolean`

Defined in: [types.ts:90](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L90)

`true` when the transaction failed; set by trackers together with `status: Failed`.

***

### isTrackedModalOpen?

> `optional` **isTrackedModalOpen?**: `boolean`

Defined in: [types.ts:92](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L92)

UI flag for a detailed tracking modal. Set from `withTrackedModal`; `closeTxTrackedModal` sets it to `false`.

***

### localTimestamp

> **localTimestamp**: `number`

Defined in: [types.ts:94](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L94)

Unix timestamp (seconds) when `executeTxAction` started. The pool is ordered and evicted by this value.

***

### payload?

> `optional` **payload?**: `Record`\<`string`, `string` \| `number`\>

Defined in: [types.ts:99](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L99)

Custom JSON data of the application. The UTF-8 JSON must be 10 KB or less, and string keys and values must not
contain executable-like patterns.

***

### pending

> **pending**: `boolean`

Defined in: [types.ts:101](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L101)

`true` while the transaction is tracked; trackers set it to `false` when it reaches a terminal status.

***

### requiredConfirmations?

> `optional` **requiredConfirmations?**: `number`

Defined in: [types.ts:130](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L130)

Number of block confirmations the EVM trackers wait for before marking the transaction successful. Defaults to 1.
The Solana tracker always waits for the `finalized` commitment instead.

***

### rpcUrl?

> `optional` **rpcUrl?**: `string`

Defined in: [types.ts:140](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L140)

RPC endpoint used by the Solana tracker, also after a page reload. Without it, the tracker uses the public
endpoint of the cluster in `chainId`.

***

### status?

> `optional` **status?**: [`TransactionStatus`](/packages/pulsar-core/enumerations/TransactionStatus.md)

Defined in: [types.ts:103](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L103)

The terminal status, set together with `pending: false`.

***

### syncStatus?

> `optional` **syncStatus?**: `"synced"` \| `"pending-sync"`

Defined in: [types.ts:146](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L146)

Remote sync state, set only when the store has an `onRemoteCreate` callback: `'pending-sync'` from the moment the
transaction is added until `onRemoteCreate` resolves (the key is listed in `unsyncedTxKeys` meanwhile and retried
if the call fails), then `'synced'`.

***

### title?

> `optional` **title?**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [types.ts:114](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L114)

User-facing title: one string for every state, or a tuple for the `[pending, success, error, replaced]` states.
Each string must be 100 characters or less and must not contain executable-like patterns such as `eval(` or
`javascript:`.

#### Example

```ts
title: 'ETH/USDC swap';
title: ['Processing swap', 'Swap complete', 'Swap error', 'Swap replaced'];
```

***

### tracker

> **tracker**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

Defined in: [types.ts:116](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L116)

The tracker that monitors the transaction.

***

### txKey

> **txKey**: `string`

Defined in: [types.ts:121](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L121)

The key of the transaction in the pool: the transaction hash, `userOpHash` (ERC-4337), `safeTxHash` (Safe), Gelato
task ID or Solana signature.

***

### type

> **type**: `string`

Defined in: [types.ts:123](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L123)

Application-specific type of the transaction, for example `'SWAP'` or `'APPROVE'`.
