[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransactionParams\<A\>

> **InitialTransactionParams**\<`A`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:165](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/types.ts#L165)

Represents the parameters required to initiate a new transaction tracking flow.

## Type Parameters

### A

`A`

## Properties

### actionFunction()

> **actionFunction**: (...`args`) => `Promise`\<`A` \| `undefined`\>

Defined in: [packages/pulsar-core/src/types.ts:168](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/types.ts#L168)

A function that can be re-executed.

#### Parameters

##### args

...`any`[]

#### Returns

`Promise`\<`A` \| `undefined`\>

***

### adapter

> **adapter**: [`TransactionAdapter`](../enumerations/TransactionAdapter.md)

Defined in: [packages/pulsar-core/src/types.ts:166](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/types.ts#L166)

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:170](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/types.ts#L170)

A user-facing description for the transaction.

***

### desiredChainID

> **desiredChainID**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:172](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/types.ts#L172)

The target chain ID for the transaction.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:174](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/types.ts#L174)

Any custom data to associate with the transaction.

***

### rpcUrl?

> `optional` **rpcUrl**: `string`

Defined in: [packages/pulsar-core/src/types.ts:182](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/types.ts#L182)

Required for Solana transactions. The RPC URL to use for the transaction.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:176](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/types.ts#L176)

A user-facing title for the transaction.

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:178](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/types.ts#L178)

The application-specific type of the transaction.

***

### withTrackedModal?

> `optional` **withTrackedModal**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:180](https://github.com/TuwaIO/pulsar-core/blob/7fb56ca30ef24d2c4e269e064078286600c47032/packages/pulsar-core/src/types.ts#L180)

If true, the detailed tracking modal will open automatically upon initiation.
