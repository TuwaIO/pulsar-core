# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [packages/pulsar-core/src/types.ts:437](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L437)

The input of `TxAdapter.checkTransactionsTracker`: the key returned by the action and the context needed to pick a
tracker.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](/packages/pulsar-core/type-aliases/ActionTxKey.md)

Defined in: [packages/pulsar-core/src/types.ts:439](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L439)

The key returned by `actionFunction`.

***

### bundlerUrl?

> `optional` **bundlerUrl?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:447](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L447)

Custom bundler RPC URL for ERC-4337 UserOperation tracking.

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:441](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L441)

The connector that signed the transaction, for example `evm:safe` for a Safe wallet.

***

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:445](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L445)

#### Deprecated

Gelato relay is deprecated. Use `bundlerUrl` / `pimlicoApiKey` with ERC-4337 instead.

***

### pimlicoApiKey?

> `optional` **pimlicoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:449](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L449)

Pimlico API key for ERC-4337 UserOperation tracking.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:443](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L443)

The tracker requested in `executeTxAction` params, if any.
