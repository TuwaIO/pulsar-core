# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [types.ts:391](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L391)

The input of `TxAdapter.checkTransactionsTracker`: the key returned by the action and the context needed to pick a
tracker.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](/packages/pulsar-core/type-aliases/ActionTxKey.md)

Defined in: [types.ts:393](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L393)

The key returned by `actionFunction`.

***

### bundlerUrl?

> `optional` **bundlerUrl?**: `string`

Defined in: [types.ts:401](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L401)

Custom bundler RPC URL for ERC-4337 UserOperation tracking.

***

### connectorType

> **connectorType**: `string`

Defined in: [types.ts:395](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L395)

The connector that signed the transaction, for example `evm:safe` for a Safe wallet.

***

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

Defined in: [types.ts:399](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L399)

#### Deprecated

Gelato relay is deprecated. Use `bundlerUrl` / `pimlicoApiKey` with ERC-4337 instead.

***

### pimlicoApiKey?

> `optional` **pimlicoApiKey?**: `string`

Defined in: [types.ts:403](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L403)

Pimlico API key for ERC-4337 UserOperation tracking.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

Defined in: [types.ts:397](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L397)

The tracker requested in `executeTxAction` params, if any.
