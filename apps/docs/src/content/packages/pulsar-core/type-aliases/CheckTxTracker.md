# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [types.ts:378](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L378)

The input of `TxAdapter.checkTransactionsTracker`: the key returned by the action and the context needed to pick a
tracker.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](/packages/pulsar-core/type-aliases/ActionTxKey.md)

Defined in: [types.ts:380](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L380)

The key returned by `actionFunction`.

***

### bundlerUrl?

> `optional` **bundlerUrl?**: `string`

Defined in: [types.ts:388](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L388)

Custom bundler RPC URL for ERC-4337 UserOperation tracking.

***

### connectorType

> **connectorType**: `string`

Defined in: [types.ts:382](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L382)

The connector that signed the transaction, for example `evm:safe` for a Safe wallet.

***

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

Defined in: [types.ts:386](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L386)

#### Deprecated

Gelato relay is deprecated. Use `bundlerUrl` / `pimlicoApiKey` with ERC-4337 instead.

***

### pimlicoApiKey?

> `optional` **pimlicoApiKey?**: `string`

Defined in: [types.ts:390](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L390)

Pimlico API key for ERC-4337 UserOperation tracking.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

Defined in: [types.ts:384](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L384)

The tracker requested in `executeTxAction` params, if any.
