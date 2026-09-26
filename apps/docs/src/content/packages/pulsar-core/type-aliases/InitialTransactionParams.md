# InitialTransactionParams

> **InitialTransactionParams** = `Pick`\<[`BaseTransaction`](/packages/pulsar-core/type-aliases/BaseTransaction.md), `"description"` \| `"title"` \| `"type"` \| `"requiredConfirmations"` \| `"rpcUrl"` \| `"payload"`\> & `Pick`\<[`EvmTransaction`](/packages/pulsar-core/type-aliases/EvmTransaction.md), `"bundlerUrl"` \| `"pimlicoApiKey"`\> & `object`

Defined in: [types.ts:239](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L239)

The metadata of a transaction passed to `executeTxAction` (as `params`, without `actionFunction`) and kept in
`initialTx`.

## Type Declaration

### actionFunction

> **actionFunction**: (...`args`) => `Promise`\<[`ActionTxKey`](/packages/pulsar-core/type-aliases/ActionTxKey.md) \| `undefined`\>

Signs and submits the transaction and returns its `ActionTxKey`, or `undefined` when the user cancelled.
`executeTxAction` calls it without arguments. The adapters' `retryTxAction` call it with
`{ config, ...payload }` (EVM) or `{ client, ...payload }` (Solana).

#### Parameters

##### args

...`unknown`[]

No arguments from `executeTxAction`; one object from `retryTxAction`.

#### Returns

`Promise`\<[`ActionTxKey`](/packages/pulsar-core/type-aliases/ActionTxKey.md) \| `undefined`\>

### adapter

> **adapter**: `OrbitAdapter`

The adapter that handles the transaction. When no configured adapter has this key, the first one is used.

### desiredChainID

> **desiredChainID**: `number` \| `string`

The chain the transaction must be sent on: a numeric chain ID for EVM (the wallet is asked to switch if needed),
or a cluster moniker such as `'devnet'` for Solana (compared with the cluster of the connected wallet).

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

Stored with the transaction and persisted to `localStorage`, but never passed to `onRemoteCreate`.

#### Deprecated

Gelato relay is deprecated. Use ERC-4337 with `bundlerUrl` or `pimlicoApiKey` instead.

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

Forces a tracker. Required for ERC-4337 (`TransactionTracker.ERC4337`) and Gelato; otherwise the adapter picks
one from the returned key and the connector.

### withTrackedModal?

> `optional` **withTrackedModal?**: `boolean`

When `true`, the transaction is created with `isTrackedModalOpen: true`.
