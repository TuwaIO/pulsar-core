[**API Reference.**](../../../README.md)

***

# BaseTransaction

> **BaseTransaction** = `object`

Defined in: [packages/pulsar-core/src/types.ts:63](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L63)

The fundamental structure for any transaction being tracked by Pulsar.
This serves as the base upon which chain-specific transaction types are built.

## Properties

### chainId

> **chainId**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:65](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L65)

The chain identifier (e.g., 1 for Ethereum Mainnet, 'SN_MAIN' for Starknet).

***

### confirmations?

> `optional` **confirmations?**: `number` \| `string` \| `null`

Defined in: [packages/pulsar-core/src/types.ts:120](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L120)

The number of confirmations received. A string value indicates a confirmed transaction, while `null` means it's pending.

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:116](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L116)

The type of connector used to sign the transaction (e.g., 'injected', 'walletConnect').

***

### description?

> `optional` **description?**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:76](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L76)

User-facing description. Can be a single string for all states, or a tuple for specific states.
Each string is validated before execution and persistence. It must be 300 characters or less and must not contain
executable-like patterns such as `eval(` or `javascript:`.

#### Example

```ts
// A single description for all states
description: 'Swap 1 ETH for 1,500 USDC'
// Specific descriptions for each state in order: [pending, success, error, replaced]
description: ['Swapping...', 'Swapped Successfully', 'Swap Failed', 'Swap Replaced']
```

***

### error?

> `optional` **error?**: `TuwaErrorState`

Defined in: [packages/pulsar-core/src/types.ts:78](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L78)

The error state if the transaction failed, containing message and raw error details.

***

### finishedTimestamp?

> `optional` **finishedTimestamp?**: `number`

Defined in: [packages/pulsar-core/src/types.ts:80](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L80)

The on-chain timestamp (in seconds) when the transaction was finalized.

***

### from

> **from**: `string`

Defined in: [packages/pulsar-core/src/types.ts:82](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L82)

The sender's wallet address.

***

### isError?

> `optional` **isError?**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:84](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L84)

A flag indicating if the transaction is in a failed state.

***

### isTrackedModalOpen?

> `optional` **isTrackedModalOpen?**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:86](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L86)

A UI flag to control the visibility of a detailed tracking modal for this transaction.

***

### localTimestamp

> **localTimestamp**: `number`

Defined in: [packages/pulsar-core/src/types.ts:88](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L88)

The local timestamp (in seconds) when the transaction was initiated by the user.

***

### payload?

> `optional` **payload?**: `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/pulsar-core/src/types.ts:93](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L93)

Custom JSON-serializable data (strings or numbers) to associate with the transaction.
The serialized UTF-8 payload must be 10KB or less and string values must not contain executable-like patterns.

***

### pending

> **pending**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:95](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L95)

A flag indicating if the transaction is still awaiting on-chain confirmation.

***

### requiredConfirmations?

> `optional` **requiredConfirmations?**: `number`

Defined in: [packages/pulsar-core/src/types.ts:118](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L118)

The number of confirmations required for the transaction to be considered confirmed.

***

### rpcUrl?

> `optional` **rpcUrl?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:122](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L122)

The RPC URL to use for the transaction. Required for Solana transactions.

***

### status?

> `optional` **status?**: [`TransactionStatus`](../enumerations/TransactionStatus.md)

Defined in: [packages/pulsar-core/src/types.ts:97](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L97)

The final on-chain status of the transaction.

***

### syncStatus?

> `optional` **syncStatus?**: `"synced"` \| `"pending-sync"`

Defined in: [packages/pulsar-core/src/types.ts:124](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L124)

Indicates the synchronization status of the transaction with the remote backend (Quasar).

***

### title?

> `optional` **title?**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:108](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L108)

User-facing title. Can be a single string for all states, or a tuple for specific states.
Each string is validated before execution and persistence. It must be 100 characters or less and must not contain
executable-like patterns such as `eval(` or `javascript:`.

#### Example

```ts
// A single title for all states
title: 'ETH/USDC Swap'
// Specific titles for each state in order: [pending, success, error, replaced]
title: ['Processing Swap', 'Swap Complete', 'Swap Error', 'Swap Replaced']
```

***

### tracker

> **tracker**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:110](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L110)

The specific tracker responsible for monitoring this transaction's status.

***

### txKey

> **txKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:112](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L112)

The unique identifier for the transaction (e.g., EVM hash, Solana signature, or Gelato task ID).

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:114](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L114)

The application-specific type or category of the transaction (e.g., 'SWAP', 'APPROVE').
