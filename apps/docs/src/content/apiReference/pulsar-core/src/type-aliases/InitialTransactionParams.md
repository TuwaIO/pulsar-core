[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransactionParams

> **InitialTransactionParams** = `object`

Defined in: [packages/pulsar-core/src/types.ts:177](https://github.com/TuwaIO/pulsar-core/blob/928b4abd468937ebb2f4d259564a606d86384480/packages/pulsar-core/src/types.ts#L177)

Represents the parameters required to initiate a new transaction tracking flow.

## Properties

### actionFunction()

> **actionFunction**: (...`args`) => `Promise`\<[`ActionTxKey`](ActionTxKey.md) \| `undefined`\>

Defined in: [packages/pulsar-core/src/types.ts:181](https://github.com/TuwaIO/pulsar-core/blob/928b4abd468937ebb2f4d259564a606d86384480/packages/pulsar-core/src/types.ts#L181)

The function that executes the on-chain action (e.g., sending a transaction) and returns a preliminary identifier like a hash.

#### Parameters

##### args

...`any`[]

#### Returns

`Promise`\<[`ActionTxKey`](ActionTxKey.md) \| `undefined`\>

***

### adapter

> **adapter**: `OrbitAdapter`

Defined in: [packages/pulsar-core/src/types.ts:179](https://github.com/TuwaIO/pulsar-core/blob/928b4abd468937ebb2f4d259564a606d86384480/packages/pulsar-core/src/types.ts#L179)

The specific blockchain adapter for this transaction.

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:183](https://github.com/TuwaIO/pulsar-core/blob/928b4abd468937ebb2f4d259564a606d86384480/packages/pulsar-core/src/types.ts#L183)

A user-facing description for the transaction. Supports state-specific descriptions.

***

### desiredChainID

> **desiredChainID**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:185](https://github.com/TuwaIO/pulsar-core/blob/928b4abd468937ebb2f4d259564a606d86384480/packages/pulsar-core/src/types.ts#L185)

The target chain ID for the transaction.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:187](https://github.com/TuwaIO/pulsar-core/blob/928b4abd468937ebb2f4d259564a606d86384480/packages/pulsar-core/src/types.ts#L187)

Any custom data to associate with the transaction.

***

### rpcUrl?

> `optional` **rpcUrl**: `string`

Defined in: [packages/pulsar-core/src/types.ts:195](https://github.com/TuwaIO/pulsar-core/blob/928b4abd468937ebb2f4d259564a606d86384480/packages/pulsar-core/src/types.ts#L195)

The RPC URL to use for the transaction. Required for Solana transactions.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:189](https://github.com/TuwaIO/pulsar-core/blob/928b4abd468937ebb2f4d259564a606d86384480/packages/pulsar-core/src/types.ts#L189)

A user-facing title for the transaction. Supports state-specific titles.

***

### tracker?

> `optional` **tracker**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:197](https://github.com/TuwaIO/pulsar-core/blob/928b4abd468937ebb2f4d259564a606d86384480/packages/pulsar-core/src/types.ts#L197)

The transaction tracker. Required for Gelato transactions.

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:191](https://github.com/TuwaIO/pulsar-core/blob/928b4abd468937ebb2f4d259564a606d86384480/packages/pulsar-core/src/types.ts#L191)

The application-specific type of the transaction.

***

### withTrackedModal?

> `optional` **withTrackedModal**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:193](https://github.com/TuwaIO/pulsar-core/blob/928b4abd468937ebb2f4d259564a606d86384480/packages/pulsar-core/src/types.ts#L193)

If true, the detailed tracking modal will open automatically upon initiation.
