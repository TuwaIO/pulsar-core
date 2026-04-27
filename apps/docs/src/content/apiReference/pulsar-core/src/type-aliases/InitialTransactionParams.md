[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransactionParams

> **InitialTransactionParams** = `Pick`\<[`BaseTransaction`](BaseTransaction.md), `"description"` \| `"title"` \| `"type"` \| `"tracker"` \| `"requiredConfirmations"` \| `"rpcUrl"` \| `"payload"`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:179](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-core/src/types.ts#L179)

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

### withTrackedModal?

> `optional` **withTrackedModal?**: `boolean`

If true, the detailed tracking modal will open automatically upon initiation.
