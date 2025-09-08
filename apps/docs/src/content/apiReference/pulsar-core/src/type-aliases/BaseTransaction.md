[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# BaseTransaction\<T\>

> **BaseTransaction**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:49](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L49)

The base structure for any transaction being tracked.

## Type Parameters

### T

`T`

The type of the tracker identifier (e.g., 'evm', 'safe').

## Properties

### actionKey?

> `optional` **actionKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:51](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L51)

A key identifying the retry logic for this transaction from the actions registry.

***

### chainId

> **chainId**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:53](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L53)

The chain identifier (e.g., 1 for Ethereum Mainnet, 'SN_MAIN' for Starknet).

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:55](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L55)

A description for the transaction, with states for [pending, success, error, replaced].

***

### errorMessage?

> `optional` **errorMessage**: `string`

Defined in: [packages/pulsar-core/src/types.ts:57](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L57)

An error message if the transaction failed.

***

### finishedTimestamp?

> `optional` **finishedTimestamp**: `number`

Defined in: [packages/pulsar-core/src/types.ts:59](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L59)

The timestamp (in seconds) when the transaction was finalized on-chain.

***

### from

> **from**: `string`

Defined in: [packages/pulsar-core/src/types.ts:61](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L61)

The sender's address.

***

### isError?

> `optional` **isError**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:63](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L63)

A flag indicating if the transaction is in a failed state.

***

### isTrackedModalOpen?

> `optional` **isTrackedModalOpen**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:65](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L65)

A flag indicating if the detailed tracking modal should be open for this transaction. For UI purposes.

***

### localTimestamp

> **localTimestamp**: `number`

Defined in: [packages/pulsar-core/src/types.ts:67](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L67)

The local timestamp (in seconds) when the transaction was initiated.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:69](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L69)

Any additional data associated with the transaction.

***

### pending

> **pending**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:71](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L71)

Indicates if the transaction is still pending confirmation.

***

### status?

> `optional` **status**: [`TransactionStatus`](../enumerations/TransactionStatus.md)

Defined in: [packages/pulsar-core/src/types.ts:73](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L73)

The final status of the transaction.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:75](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L75)

A title for the transaction, with states for [pending, success, error, replaced].

***

### tracker

> **tracker**: `T`

Defined in: [packages/pulsar-core/src/types.ts:77](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L77)

The specific tracker responsible for monitoring this transaction (e.g., 'evm', 'safe', 'gelato', etc.).

***

### txKey

> **txKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:79](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L79)

The unique key for the transaction within its tracker (e.g., EVM hash, Gelato task ID).

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:81](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L81)

The type or category of the transaction (e.g., 'increment', 'approve').

***

### walletType

> **walletType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:83](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L83)

The type of wallet used for the transaction.
