[**API Reference.**](../../../README.md)

***

# InitialTransactionParams

> **InitialTransactionParams** = `Pick`\<[`BaseTransaction`](BaseTransaction.md), `"description"` \| `"title"` \| `"type"` \| `"requiredConfirmations"` \| `"rpcUrl"` \| `"payload"`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:186](https://github.com/TuwaIO/pulsar-core/blob/17a55cf59aedebd775206822ceabe49db52c0f88/packages/pulsar-core/src/types.ts#L186)

Represents the parameters required to initiate a new transaction tracking flow.

## Type Declaration

### actionFunction

> **actionFunction**: (...`args`) => `Promise`\<[`ActionTxKey`](ActionTxKey.md) \| `undefined`\>

The function that executes the on-chain action (e.g., sending a transaction) and returns a preliminary identifier like a hash.

#### Parameters

##### args

...`any`[]

#### Returns

`Promise`\<[`ActionTxKey`](ActionTxKey.md) \| `undefined`\>

### adapter

> **adapter**: `OrbitAdapter`

The specific blockchain adapter for this transaction.

### desiredChainID

> **desiredChainID**: `number` \| `string`

The target chain ID for the transaction.

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

The specific tracker responsible for monitoring this transaction's status. Required for Gelato tracker.

### withTrackedModal?

> `optional` **withTrackedModal?**: `boolean`

If true, the detailed tracking modal will open automatically upon initiation.
