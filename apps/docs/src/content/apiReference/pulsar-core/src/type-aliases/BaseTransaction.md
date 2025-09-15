[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# BaseTransaction\<T\>

> **BaseTransaction**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:58](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L58)

The fundamental structure for any transaction being tracked by Pulsar.
This forms the base upon which chain-specific transaction types are built.

## Type Parameters

### T

`T`

The type of the tracker identifier (e.g., 'ethereum', 'gelato', 'safe').

## Properties

### chainId

> **chainId**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:60](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L60)

The chain identifier (e.g., 1 for Ethereum Mainnet, 'SN_MAIN' for Starknet).

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:62](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L62)

A user-facing description. Can be a single string or an array for [pending, success, error, replaced] states.

***

### errorMessage?

> `optional` **errorMessage**: `string`

Defined in: [packages/pulsar-core/src/types.ts:64](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L64)

The error message if the transaction failed.

***

### finishedTimestamp?

> `optional` **finishedTimestamp**: `number`

Defined in: [packages/pulsar-core/src/types.ts:66](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L66)

The on-chain timestamp (in seconds) when the transaction was finalized.

***

### from

> **from**: `string`

Defined in: [packages/pulsar-core/src/types.ts:68](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L68)

The sender's wallet address.

***

### isError?

> `optional` **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:70](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L70)

A flag indicating if the transaction is in a failed state.

***

### isTrackedModalOpen?

> `optional` **isTrackedModalOpen**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:72](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L72)

A UI flag to control the visibility of a detailed tracking modal for this transaction.

***

### localTimestamp

> **localTimestamp**: `number`

Defined in: [packages/pulsar-core/src/types.ts:74](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L74)

The local timestamp (in seconds) when the transaction was initiated by the user.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:76](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L76)

Any additional, custom data associated with the transaction.

***

### pending

> **pending**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:78](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L78)

A flag indicating if the transaction is still awaiting on-chain confirmation.

***

### status?

> `optional` **status**: [`TransactionStatus`](../enumerations/TransactionStatus.md)

Defined in: [packages/pulsar-core/src/types.ts:80](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L80)

The final on-chain status of the transaction.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:82](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L82)

A user-facing title. Can be a single string or an array for [pending, success, error, replaced] states.

***

### tracker

> **tracker**: `T`

Defined in: [packages/pulsar-core/src/types.ts:84](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L84)

The specific tracker responsible for monitoring this transaction's status.

***

### txKey

> **txKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:86](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L86)

The unique identifier for the transaction (e.g., EVM hash, Gelato task ID).

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:88](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L88)

The application-specific type or category of the transaction (e.g., 'SWAP', 'APPROVE').

***

### walletType

> **walletType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:90](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L90)

The type of wallet used to sign the transaction (e.g., 'injected', 'walletConnect').
