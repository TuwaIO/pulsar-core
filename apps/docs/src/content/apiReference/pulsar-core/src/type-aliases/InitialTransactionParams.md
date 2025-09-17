[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransactionParams\<A\>

> **InitialTransactionParams**\<`A`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:179](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-core/src/types.ts#L179)

Represents the parameters required to initiate a new transaction tracking flow.

## Type Parameters

### A

`A`

## Properties

### actionFunction()

> **actionFunction**: (...`args`) => `Promise`\<`A` \| `undefined`\>

Defined in: [packages/pulsar-core/src/types.ts:182](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-core/src/types.ts#L182)

The function that executes the on-chain action (e.g., sending a transaction) and returns a preliminary identifier like a hash.

#### Parameters

##### args

...`any`[]

#### Returns

`Promise`\<`A` \| `undefined`\>

***

### adapter

> **adapter**: [`TransactionAdapter`](../enumerations/TransactionAdapter.md)

Defined in: [packages/pulsar-core/src/types.ts:180](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-core/src/types.ts#L180)

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:184](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-core/src/types.ts#L184)

A user-facing description for the transaction. Supports state-specific descriptions.

***

### desiredChainID

> **desiredChainID**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:186](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-core/src/types.ts#L186)

The target chain ID for the transaction.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:188](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-core/src/types.ts#L188)

Any custom data to associate with the transaction.

***

### rpcUrl?

> `optional` **rpcUrl**: `string`

Defined in: [packages/pulsar-core/src/types.ts:196](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-core/src/types.ts#L196)

The RPC URL to use for the transaction. Required for Solana transactions.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:190](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-core/src/types.ts#L190)

A user-facing title for the transaction. Supports state-specific titles.

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:192](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-core/src/types.ts#L192)

The application-specific type of the transaction.

***

### withTrackedModal?

> `optional` **withTrackedModal**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:194](https://github.com/TuwaIO/pulsar-core/blob/bbb9e2e0f0f23382d49e10f4e6c8ee38979bf353/packages/pulsar-core/src/types.ts#L194)

If true, the detailed tracking modal will open automatically upon initiation.
