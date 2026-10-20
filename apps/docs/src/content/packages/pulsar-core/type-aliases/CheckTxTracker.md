# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [types.ts:425](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L425)

The input of `TxAdapter.checkTransactionsTracker`: the key returned by the action and the context needed to pick a
tracker.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](/packages/pulsar-core/type-aliases/ActionTxKey.md)

Defined in: [types.ts:427](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L427)

The key returned by `actionFunction`.

***

### bundlerUrl?

> `optional` **bundlerUrl?**: `string`

Defined in: [types.ts:435](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L435)

Custom bundler RPC URL for ERC-4337 UserOperation tracking.

***

### connectorType

> **connectorType**: `string`

Defined in: [types.ts:429](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L429)

The connector that signed the transaction, for example `evm:safe` for a Safe wallet.

***

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

Defined in: [types.ts:433](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L433)

#### Deprecated

Gelato relay is deprecated. Use `bundlerUrl` / `pimlicoApiKey` with ERC-4337 instead.

***

### pimlicoApiKey?

> `optional` **pimlicoApiKey?**: `string`

Defined in: [types.ts:437](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L437)

Pimlico API key for ERC-4337 UserOperation tracking.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

Defined in: [types.ts:431](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L431)

The tracker requested in `executeTxAction` params, if any.
