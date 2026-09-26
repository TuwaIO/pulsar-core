# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [types.ts:369](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L369)

The input of `TxAdapter.checkTransactionsTracker`: the key returned by the action and the context needed to pick a
tracker.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](/packages/pulsar-core/type-aliases/ActionTxKey.md)

Defined in: [types.ts:371](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L371)

The key returned by `actionFunction`.

***

### bundlerUrl?

> `optional` **bundlerUrl?**: `string`

Defined in: [types.ts:379](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L379)

Custom bundler RPC URL for ERC-4337 UserOperation tracking.

***

### connectorType

> **connectorType**: `string`

Defined in: [types.ts:373](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L373)

The connector that signed the transaction, for example `evm:safe` for a Safe wallet.

***

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

Defined in: [types.ts:377](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L377)

#### Deprecated

Gelato relay is deprecated. Use `bundlerUrl` / `pimlicoApiKey` with ERC-4337 instead.

***

### pimlicoApiKey?

> `optional` **pimlicoApiKey?**: `string`

Defined in: [types.ts:381](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L381)

Pimlico API key for ERC-4337 UserOperation tracking.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

Defined in: [types.ts:375](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L375)

The tracker requested in `executeTxAction` params, if any.
