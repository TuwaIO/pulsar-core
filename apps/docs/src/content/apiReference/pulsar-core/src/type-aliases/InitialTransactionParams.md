[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransactionParams

> **InitialTransactionParams** = `object`

Defined in: [packages/pulsar-core/src/types.ts:186](https://github.com/TuwaIO/pulsar-core/blob/b90238926d902fe8ff6f2fc7ccda63c1dd3ac942/packages/pulsar-core/src/types.ts#L186)

Represents the parameters required to initiate a new transaction tracking flow.

## Properties

### actionFunction()

> **actionFunction**: (...`args`) => `Promise`\<[`ActionTxKey`](ActionTxKey.md) \| `undefined`\>

Defined in: [packages/pulsar-core/src/types.ts:190](https://github.com/TuwaIO/pulsar-core/blob/b90238926d902fe8ff6f2fc7ccda63c1dd3ac942/packages/pulsar-core/src/types.ts#L190)

The function that executes the on-chain action (e.g., sending a transaction) and returns a preliminary identifier like a hash.

#### Parameters

##### args

...`any`[]

#### Returns

`Promise`\<[`ActionTxKey`](ActionTxKey.md) \| `undefined`\>

***

### adapter

> **adapter**: `OrbitAdapter`

Defined in: [packages/pulsar-core/src/types.ts:188](https://github.com/TuwaIO/pulsar-core/blob/b90238926d902fe8ff6f2fc7ccda63c1dd3ac942/packages/pulsar-core/src/types.ts#L188)

The specific blockchain adapter for this transaction.

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:192](https://github.com/TuwaIO/pulsar-core/blob/b90238926d902fe8ff6f2fc7ccda63c1dd3ac942/packages/pulsar-core/src/types.ts#L192)

A user-facing description for the transaction. Supports state-specific descriptions.

***

### desiredChainID

> **desiredChainID**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:194](https://github.com/TuwaIO/pulsar-core/blob/b90238926d902fe8ff6f2fc7ccda63c1dd3ac942/packages/pulsar-core/src/types.ts#L194)

The target chain ID for the transaction.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:196](https://github.com/TuwaIO/pulsar-core/blob/b90238926d902fe8ff6f2fc7ccda63c1dd3ac942/packages/pulsar-core/src/types.ts#L196)

Any custom data to associate with the transaction.

***

### rpcUrl?

> `optional` **rpcUrl**: `string`

Defined in: [packages/pulsar-core/src/types.ts:204](https://github.com/TuwaIO/pulsar-core/blob/b90238926d902fe8ff6f2fc7ccda63c1dd3ac942/packages/pulsar-core/src/types.ts#L204)

The RPC URL to use for the transaction. Required for Solana transactions.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:198](https://github.com/TuwaIO/pulsar-core/blob/b90238926d902fe8ff6f2fc7ccda63c1dd3ac942/packages/pulsar-core/src/types.ts#L198)

A user-facing title for the transaction. Supports state-specific titles.

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:200](https://github.com/TuwaIO/pulsar-core/blob/b90238926d902fe8ff6f2fc7ccda63c1dd3ac942/packages/pulsar-core/src/types.ts#L200)

The application-specific type of the transaction.

***

### withTrackedModal?

> `optional` **withTrackedModal**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:202](https://github.com/TuwaIO/pulsar-core/blob/b90238926d902fe8ff6f2fc7ccda63c1dd3ac942/packages/pulsar-core/src/types.ts#L202)

If true, the detailed tracking modal will open automatically upon initiation.
