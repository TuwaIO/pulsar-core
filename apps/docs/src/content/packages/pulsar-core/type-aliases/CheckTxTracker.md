# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [types.ts:398](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L398)

The input of `TxAdapter.checkTransactionsTracker`: the key returned by the action and the context needed to pick a
tracker.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](/packages/pulsar-core/type-aliases/ActionTxKey.md)

Defined in: [types.ts:400](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L400)

The key returned by `actionFunction`.

***

### bundlerUrl?

> `optional` **bundlerUrl?**: `string`

Defined in: [types.ts:408](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L408)

Custom bundler RPC URL for ERC-4337 UserOperation tracking.

***

### connectorType

> **connectorType**: `string`

Defined in: [types.ts:402](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L402)

The connector that signed the transaction, for example `evm:safe` for a Safe wallet.

***

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

Defined in: [types.ts:406](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L406)

#### Deprecated

Gelato relay is deprecated. Use `bundlerUrl` / `pimlicoApiKey` with ERC-4337 instead.

***

### pimlicoApiKey?

> `optional` **pimlicoApiKey?**: `string`

Defined in: [types.ts:410](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L410)

Pimlico API key for ERC-4337 UserOperation tracking.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

Defined in: [types.ts:404](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L404)

The tracker requested in `executeTxAction` params, if any.
