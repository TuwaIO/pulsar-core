# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [types.ts:436](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L436)

The input of `TxAdapter.checkTransactionsTracker`: the key returned by the action and the context needed to pick a
tracker.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](/packages/pulsar-core/type-aliases/ActionTxKey.md)

Defined in: [types.ts:438](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L438)

The key returned by `actionFunction`.

***

### bundlerUrl?

> `optional` **bundlerUrl?**: `string`

Defined in: [types.ts:446](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L446)

Custom bundler RPC URL for ERC-4337 UserOperation tracking.

***

### connectorType

> **connectorType**: `string`

Defined in: [types.ts:440](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L440)

The connector that signed the transaction, for example `evm:safe` for a Safe wallet.

***

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

Defined in: [types.ts:444](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L444)

#### Deprecated

Gelato relay is deprecated. Use `bundlerUrl` / `pimlicoApiKey` with ERC-4337 instead.

***

### pimlicoApiKey?

> `optional` **pimlicoApiKey?**: `string`

Defined in: [types.ts:448](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L448)

Pimlico API key for ERC-4337 UserOperation tracking.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

Defined in: [types.ts:442](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L442)

The tracker requested in `executeTxAction` params, if any.
