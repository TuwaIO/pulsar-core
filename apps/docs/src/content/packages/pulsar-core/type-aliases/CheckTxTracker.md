# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [packages/pulsar-core/src/types.ts:449](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L449)

The input of `TxAdapter.checkTransactionsTracker`: the key returned by the action and the context needed to pick a
tracker.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](/packages/pulsar-core/type-aliases/ActionTxKey.md)

Defined in: [packages/pulsar-core/src/types.ts:451](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L451)

The key returned by `actionFunction`.

***

### bundlerUrl?

> `optional` **bundlerUrl?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:459](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L459)

Custom bundler RPC URL for ERC-4337 UserOperation tracking.

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:453](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L453)

The connector that signed the transaction, for example `evm:safe` for a Safe wallet.

***

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:457](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L457)

#### Deprecated

Gelato relay is deprecated. Use `bundlerUrl` / `pimlicoApiKey` with ERC-4337 instead.

***

### pimlicoApiKey?

> `optional` **pimlicoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:461](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L461)

Pimlico API key for ERC-4337 UserOperation tracking.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:455](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L455)

The tracker requested in `executeTxAction` params, if any.
