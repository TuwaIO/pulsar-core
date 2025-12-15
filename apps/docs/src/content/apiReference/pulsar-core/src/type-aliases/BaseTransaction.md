[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# BaseTransaction

> **BaseTransaction** = `object`

Defined in: [packages/pulsar-core/src/types.ts:67](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L67)

The fundamental structure for any transaction being tracked by Pulsar.
This serves as the base upon which chain-specific transaction types are built.

## Properties

### chainId

> **chainId**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:69](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L69)

The chain identifier (e.g., 1 for Ethereum Mainnet, 'SN_MAIN' for Starknet).

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:113](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L113)

The type of connector used to sign the transaction (e.g., 'injected', 'walletConnect').

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:78](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L78)

User-facing description. Can be a single string for all states, or a tuple for specific states.

#### Example

```ts
// A single description for all states
description: 'Swap 1 ETH for 1,500 USDC'
// Specific descriptions for each state in order: [pending, success, error, replaced]
description: ['Swapping...', 'Swapped Successfully', 'Swap Failed', 'Swap Replaced']
```

***

### errorMessage?

> `optional` **errorMessage**: `string`

Defined in: [packages/pulsar-core/src/types.ts:80](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L80)

The error message if the transaction failed.

***

### finishedTimestamp?

> `optional` **finishedTimestamp**: `number`

Defined in: [packages/pulsar-core/src/types.ts:82](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L82)

The on-chain timestamp (in seconds) when the transaction was finalized.

***

### from

> **from**: `string`

Defined in: [packages/pulsar-core/src/types.ts:84](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L84)

The sender's wallet address.

***

### isError?

> `optional` **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:86](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L86)

A flag indicating if the transaction is in a failed state.

***

### isTrackedModalOpen?

> `optional` **isTrackedModalOpen**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:88](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L88)

A UI flag to control the visibility of a detailed tracking modal for this transaction.

***

### localTimestamp

> **localTimestamp**: `number`

Defined in: [packages/pulsar-core/src/types.ts:90](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L90)

The local timestamp (in seconds) when the transaction was initiated by the user.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:92](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L92)

Any additional, custom data associated with the transaction.

***

### pending

> **pending**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:94](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L94)

A flag indicating if the transaction is still awaiting on-chain confirmation.

***

### status?

> `optional` **status**: [`TransactionStatus`](../enumerations/TransactionStatus.md)

Defined in: [packages/pulsar-core/src/types.ts:96](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L96)

The final on-chain status of the transaction.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:105](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L105)

User-facing title. Can be a single string for all states, or a tuple for specific states.

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

Defined in: [packages/pulsar-core/src/types.ts:107](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L107)

The specific tracker responsible for monitoring this transaction's status.

***

### txKey

> **txKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:109](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L109)

The unique identifier for the transaction (e.g., EVM hash, Solana signature, or Gelato task ID).

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:111](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L111)

The application-specific type or category of the transaction (e.g., 'SWAP', 'APPROVE').
