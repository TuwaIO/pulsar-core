[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransactionParams

> **InitialTransactionParams** = `object`

Defined in: [packages/pulsar-core/src/types.ts:211](https://github.com/TuwaIO/pulsar-core/blob/c72496708aaee3876552289f9710c5c529bb4798/packages/pulsar-core/src/types.ts#L211)

Represents the parameters required to initiate a new transaction tracking flow.

## Properties

### actionFunction()

> **actionFunction**: (...`args`) => `Promise`\<[`ActionTxKey`](ActionTxKey.md) \| `undefined`\>

Defined in: [packages/pulsar-core/src/types.ts:215](https://github.com/TuwaIO/pulsar-core/blob/c72496708aaee3876552289f9710c5c529bb4798/packages/pulsar-core/src/types.ts#L215)

The function that executes the on-chain action (e.g., sending a transaction) and returns a preliminary identifier like a hash.

#### Parameters

##### args

...`any`[]

#### Returns

`Promise`\<[`ActionTxKey`](ActionTxKey.md) \| `undefined`\>

***

### adapter

> **adapter**: [`TransactionAdapter`](../enumerations/TransactionAdapter.md)

Defined in: [packages/pulsar-core/src/types.ts:213](https://github.com/TuwaIO/pulsar-core/blob/c72496708aaee3876552289f9710c5c529bb4798/packages/pulsar-core/src/types.ts#L213)

The specific blockchain adapter for this transaction.

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:217](https://github.com/TuwaIO/pulsar-core/blob/c72496708aaee3876552289f9710c5c529bb4798/packages/pulsar-core/src/types.ts#L217)

A user-facing description for the transaction. Supports state-specific descriptions.

***

### desiredChainID

> **desiredChainID**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:219](https://github.com/TuwaIO/pulsar-core/blob/c72496708aaee3876552289f9710c5c529bb4798/packages/pulsar-core/src/types.ts#L219)

The target chain ID for the transaction.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:221](https://github.com/TuwaIO/pulsar-core/blob/c72496708aaee3876552289f9710c5c529bb4798/packages/pulsar-core/src/types.ts#L221)

Any custom data to associate with the transaction.

***

### rpcUrl?

> `optional` **rpcUrl**: `string`

Defined in: [packages/pulsar-core/src/types.ts:229](https://github.com/TuwaIO/pulsar-core/blob/c72496708aaee3876552289f9710c5c529bb4798/packages/pulsar-core/src/types.ts#L229)

The RPC URL to use for the transaction. Required for Solana transactions.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:223](https://github.com/TuwaIO/pulsar-core/blob/c72496708aaee3876552289f9710c5c529bb4798/packages/pulsar-core/src/types.ts#L223)

A user-facing title for the transaction. Supports state-specific titles.

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:225](https://github.com/TuwaIO/pulsar-core/blob/c72496708aaee3876552289f9710c5c529bb4798/packages/pulsar-core/src/types.ts#L225)

The application-specific type of the transaction.

***

### withTrackedModal?

> `optional` **withTrackedModal**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:227](https://github.com/TuwaIO/pulsar-core/blob/c72496708aaee3876552289f9710c5c529bb4798/packages/pulsar-core/src/types.ts#L227)

If true, the detailed tracking modal will open automatically upon initiation.
