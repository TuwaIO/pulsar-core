[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# BaseTransaction

> **BaseTransaction** = `object`

Defined in: [packages/pulsar-core/src/types.ts:58](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L58)

The fundamental structure for any transaction being tracked by Pulsar.
This serves as the base upon which chain-specific transaction types are built.

## Properties

### chainId

> **chainId**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:60](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L60)

The chain identifier (e.g., 1 for Ethereum Mainnet, 'SN_MAIN' for Starknet).

***

### confirmations?

> `optional` **confirmations?**: `number` \| `string` \| `null`

Defined in: [packages/pulsar-core/src/types.ts:115](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L115)

The number of confirmations received. A string value indicates a confirmed transaction, while `null` means it's pending.

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:111](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L111)

The type of connector used to sign the transaction (e.g., 'injected', 'walletConnect').

***

### description?

> `optional` **description?**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:71](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L71)

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

Defined in: [packages/pulsar-core/src/types.ts:73](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L73)

The error state if the transaction failed, containing message and raw error details.

***

### finishedTimestamp?

> `optional` **finishedTimestamp?**: `number`

Defined in: [packages/pulsar-core/src/types.ts:75](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L75)

The on-chain timestamp (in seconds) when the transaction was finalized.

***

### from

> **from**: `string`

Defined in: [packages/pulsar-core/src/types.ts:77](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L77)

The sender's wallet address.

***

### isError?

> `optional` **isError?**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:79](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L79)

A flag indicating if the transaction is in a failed state.

***

### isTrackedModalOpen?

> `optional` **isTrackedModalOpen?**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:81](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L81)

A UI flag to control the visibility of a detailed tracking modal for this transaction.

***

### localTimestamp

> **localTimestamp**: `number`

Defined in: [packages/pulsar-core/src/types.ts:83](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L83)

The local timestamp (in seconds) when the transaction was initiated by the user.

***

### payload?

> `optional` **payload?**: `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/pulsar-core/src/types.ts:88](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L88)

Custom JSON-serializable data (strings or numbers) to associate with the transaction.
The serialized UTF-8 payload must be 10KB or less and string values must not contain executable-like patterns.

***

### pending

> **pending**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:90](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L90)

A flag indicating if the transaction is still awaiting on-chain confirmation.

***

### requiredConfirmations?

> `optional` **requiredConfirmations?**: `number`

Defined in: [packages/pulsar-core/src/types.ts:113](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L113)

The number of confirmations required for the transaction to be considered confirmed.

***

### rpcUrl?

> `optional` **rpcUrl?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:117](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L117)

The RPC URL to use for the transaction. Required for Solana transactions.

***

### status?

> `optional` **status?**: [`TransactionStatus`](../enumerations/TransactionStatus.md)

Defined in: [packages/pulsar-core/src/types.ts:92](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L92)

The final on-chain status of the transaction.

***

### title?

> `optional` **title?**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:103](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L103)

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

Defined in: [packages/pulsar-core/src/types.ts:105](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L105)

The specific tracker responsible for monitoring this transaction's status.

***

### txKey

> **txKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:107](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L107)

The unique identifier for the transaction (e.g., EVM hash, Solana signature, or Gelato task ID).

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:109](https://github.com/TuwaIO/pulsar-core/blob/6fb72053683e08af14f2cd5f97b83ff4b8b500e1/packages/pulsar-core/src/types.ts#L109)

The application-specific type or category of the transaction (e.g., 'SWAP', 'APPROVE').
