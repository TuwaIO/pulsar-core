[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransactionParams

> **InitialTransactionParams** = `object`

Defined in: [packages/pulsar-core/src/types.ts:175](https://github.com/TuwaIO/pulsar-core/blob/36ff61e9e8d908e475c7475f7c6c5f5fe7eec72c/packages/pulsar-core/src/types.ts#L175)

Represents the parameters required to initiate a new transaction tracking flow.

## Properties

### actionFunction()

> **actionFunction**: (...`args`) => `Promise`\<[`ActionTxKey`](ActionTxKey.md) \| `undefined`\>

Defined in: [packages/pulsar-core/src/types.ts:179](https://github.com/TuwaIO/pulsar-core/blob/36ff61e9e8d908e475c7475f7c6c5f5fe7eec72c/packages/pulsar-core/src/types.ts#L179)

The function that executes the on-chain action (e.g., sending a transaction) and returns a preliminary identifier like a hash.

#### Parameters

##### args

...`any`[]

#### Returns

`Promise`\<[`ActionTxKey`](ActionTxKey.md) \| `undefined`\>

***

### adapter

> **adapter**: `OrbitAdapter`

Defined in: [packages/pulsar-core/src/types.ts:177](https://github.com/TuwaIO/pulsar-core/blob/36ff61e9e8d908e475c7475f7c6c5f5fe7eec72c/packages/pulsar-core/src/types.ts#L177)

The specific blockchain adapter for this transaction.

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:181](https://github.com/TuwaIO/pulsar-core/blob/36ff61e9e8d908e475c7475f7c6c5f5fe7eec72c/packages/pulsar-core/src/types.ts#L181)

A user-facing description for the transaction. Supports state-specific descriptions.

***

### desiredChainID

> **desiredChainID**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:183](https://github.com/TuwaIO/pulsar-core/blob/36ff61e9e8d908e475c7475f7c6c5f5fe7eec72c/packages/pulsar-core/src/types.ts#L183)

The target chain ID for the transaction.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:185](https://github.com/TuwaIO/pulsar-core/blob/36ff61e9e8d908e475c7475f7c6c5f5fe7eec72c/packages/pulsar-core/src/types.ts#L185)

Any custom data to associate with the transaction.

***

### rpcUrl?

> `optional` **rpcUrl**: `string`

Defined in: [packages/pulsar-core/src/types.ts:193](https://github.com/TuwaIO/pulsar-core/blob/36ff61e9e8d908e475c7475f7c6c5f5fe7eec72c/packages/pulsar-core/src/types.ts#L193)

The RPC URL to use for the transaction. Required for Solana transactions.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:187](https://github.com/TuwaIO/pulsar-core/blob/36ff61e9e8d908e475c7475f7c6c5f5fe7eec72c/packages/pulsar-core/src/types.ts#L187)

A user-facing title for the transaction. Supports state-specific titles.

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:189](https://github.com/TuwaIO/pulsar-core/blob/36ff61e9e8d908e475c7475f7c6c5f5fe7eec72c/packages/pulsar-core/src/types.ts#L189)

The application-specific type of the transaction.

***

### withTrackedModal?

> `optional` **withTrackedModal**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:191](https://github.com/TuwaIO/pulsar-core/blob/36ff61e9e8d908e475c7475f7c6c5f5fe7eec72c/packages/pulsar-core/src/types.ts#L191)

If true, the detailed tracking modal will open automatically upon initiation.
