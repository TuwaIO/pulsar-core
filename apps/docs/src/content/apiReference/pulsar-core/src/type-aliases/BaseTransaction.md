[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# BaseTransaction

> **BaseTransaction** = `object`

Defined in: [packages/pulsar-core/src/types.ts:56](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L56)

The fundamental structure for any transaction being tracked by Pulsar.
This serves as the base upon which chain-specific transaction types are built.

## Properties

### chainId

> **chainId**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:58](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L58)

The chain identifier (e.g., 1 for Ethereum Mainnet, 'SN_MAIN' for Starknet).

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:67](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L67)

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

Defined in: [packages/pulsar-core/src/types.ts:69](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L69)

The error message if the transaction failed.

***

### finishedTimestamp?

> `optional` **finishedTimestamp**: `number`

Defined in: [packages/pulsar-core/src/types.ts:71](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L71)

The on-chain timestamp (in seconds) when the transaction was finalized.

***

### from

> **from**: `string`

Defined in: [packages/pulsar-core/src/types.ts:73](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L73)

The sender's wallet address.

***

### isError?

> `optional` **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:75](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L75)

A flag indicating if the transaction is in a failed state.

***

### isTrackedModalOpen?

> `optional` **isTrackedModalOpen**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:77](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L77)

A UI flag to control the visibility of a detailed tracking modal for this transaction.

***

### localTimestamp

> **localTimestamp**: `number`

Defined in: [packages/pulsar-core/src/types.ts:79](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L79)

The local timestamp (in seconds) when the transaction was initiated by the user.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:81](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L81)

Any additional, custom data associated with the transaction.

***

### pending

> **pending**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:83](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L83)

A flag indicating if the transaction is still awaiting on-chain confirmation.

***

### status?

> `optional` **status**: [`TransactionStatus`](../enumerations/TransactionStatus.md)

Defined in: [packages/pulsar-core/src/types.ts:85](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L85)

The final on-chain status of the transaction.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:94](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L94)

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

Defined in: [packages/pulsar-core/src/types.ts:96](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L96)

The specific tracker responsible for monitoring this transaction's status.

***

### txKey

> **txKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:98](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L98)

The unique identifier for the transaction (e.g., EVM hash, Solana signature, or Gelato task ID).

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:100](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L100)

The application-specific type or category of the transaction (e.g., 'SWAP', 'APPROVE').

***

### walletType

> **walletType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:102](https://github.com/TuwaIO/pulsar-core/blob/c5d727eb6b89fac4171ea8d2088e9ef26b001b7c/packages/pulsar-core/src/types.ts#L102)

The type of wallet used to sign the transaction (e.g., 'injected', 'walletConnect').
