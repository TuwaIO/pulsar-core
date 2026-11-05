# BaseTransaction

> **BaseTransaction** = `object`

Defined in: [packages/pulsar-core/src/types.ts:70](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L70)

Fields shared by every tracked transaction. Chain-specific transaction types extend it.

## Properties

### chainId

> **chainId**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:77](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L77)

The chain of the transaction: the numeric chain ID for EVM (for example `1`), or the CAIP-2 chain ID with the
genesis hash for Solana (for example `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` for devnet). `executeTxAction` derives
it from `desiredChainID` with `setChainId` from `@tuwaio/orbit-core`. Transactions saved by Pulsar 0.8.3 and earlier
keep `solana:<cluster>` (for example `solana:devnet`); the trackers and explorer links read both forms.

***

### confirmations?

> `optional` **confirmations?**: `number` \| `string` \| `null`

Defined in: [packages/pulsar-core/src/types.ts:146](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L146)

Confirmations reported by the tracker while the transaction is pending. The Solana tracker sets it to `'MAX'` when
the transaction is finalized. For a Safe transaction it is the number of owners who have confirmed it so far.

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:135](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L135)

The connector that signed the transaction, for example `evm:metamask` or `solana:phantom`.

***

### description?

> `optional` **description?**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:89](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L89)

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

Defined in: [packages/pulsar-core/src/types.ts:91](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L91)

The normalized error of a failed transaction (`normalizeError` from `@tuwaio/orbit-core`).

***

### finishedTimestamp?

> `optional` **finishedTimestamp?**: `number`

Defined in: [packages/pulsar-core/src/types.ts:96](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L96)

Unix timestamp (seconds) of the terminal state: the block timestamp for EVM and ERC-4337 transactions confirmed
on-chain, the execution date for Safe, and the local time otherwise.

***

### from

> **from**: `string`

Defined in: [packages/pulsar-core/src/types.ts:98](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L98)

The address of the wallet that sent the transaction, as reported by the adapter's `getConnectorInfo`.

***

### isError?

> `optional` **isError?**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:100](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L100)

`true` when the transaction failed; set by trackers together with `status: Failed`.

***

### isTrackedModalOpen?

> `optional` **isTrackedModalOpen?**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:102](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L102)

UI flag for a detailed tracking modal. Set from `withTrackedModal`; `closeTxTrackedModal` sets it to `false`.

***

### localTimestamp

> **localTimestamp**: `number`

Defined in: [packages/pulsar-core/src/types.ts:104](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L104)

Unix timestamp (seconds) when `executeTxAction` started. The pool is ordered and evicted by this value.

***

### payload?

> `optional` **payload?**: `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/pulsar-core/src/types.ts:109](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L109)

Custom JSON data of the application. The UTF-8 JSON must be 10 KB or less, and string keys and values must not
contain executable-like patterns.

***

### pending

> **pending**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:111](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L111)

`true` while the transaction is tracked; trackers set it to `false` when it reaches a terminal status.

***

### requiredConfirmations?

> `optional` **requiredConfirmations?**: `number`

Defined in: [packages/pulsar-core/src/types.ts:141](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L141)

Number of block confirmations the EVM trackers wait for before marking the transaction successful. Defaults to 1.
The Solana tracker always waits for the `finalized` commitment instead. For a Safe transaction, the Safe tracker
writes the number of owner confirmations the Safe needs to execute it (its threshold).

***

### rpcUrl?

> `optional` **rpcUrl?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:151](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L151)

RPC endpoint used by the Solana tracker, also after a page reload. Without it, the tracker uses the public
endpoint of the cluster in `chainId`.

***

### status?

> `optional` **status?**: [`TransactionStatus`](/packages/pulsar-core/enumerations/TransactionStatus.md)

Defined in: [packages/pulsar-core/src/types.ts:113](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L113)

The terminal status, set together with `pending: false`.

***

### syncStatus?

> `optional` **syncStatus?**: `"synced"` \| `"pending-sync"`

Defined in: [packages/pulsar-core/src/types.ts:157](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L157)

Remote sync state, set only when the store has an `onRemoteCreate` callback: `'pending-sync'` from the moment the
transaction is added until `onRemoteCreate` resolves (the key is listed in `unsyncedTxKeys` meanwhile and retried
if the call fails), then `'synced'`.

***

### title?

> `optional` **title?**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:124](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L124)

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

Defined in: [packages/pulsar-core/src/types.ts:126](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L126)

The tracker that monitors the transaction.

***

### txKey

> **txKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:131](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L131)

The key of the transaction in the pool: the transaction hash, `userOpHash` (ERC-4337), `safeTxHash` (Safe), Gelato
task ID or Solana signature.

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:133](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L133)

Application-specific type of the transaction, for example `'SWAP'` or `'APPROVE'`.
